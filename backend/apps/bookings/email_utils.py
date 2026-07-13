"""
Booking confirmation email with embedded QR code.
Builds the MIME structure manually using Python's standard email library
because Django 6 removed the undocumented `mixed_subtype` attribute.

Structure:
  multipart/mixed
    └── multipart/related
          ├── text/html  (references QR image via cid:)
          └── image/png  (QR code, Content-ID: <qrcode_booking_N>)
"""

import qrcode
import logging
import threading
import hashlib
import smtplib
import ssl

from io import BytesIO
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase

from django.conf import settings

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
#  QR CODE GENERATION
# ─────────────────────────────────────────────

def generate_qr_bytes(data: str) -> bytes:
    """Generate QR code PNG bytes for the given string."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#4f46e5", back_color="white")
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def build_unique_qr_data(booking) -> str:
    """
    Build a unique, tamper-evident string encoded in the QR code.
    Each booking gets a different QR because booking ID, user ID,
    event ID and timestamp are all included.
    """
    event  = booking.event
    user   = booking.user
    raw    = f"{booking.id}:{event.id}:{user.id}:{booking.booked_at}"
    ref    = hashlib.sha256(raw.encode()).hexdigest()[:12].upper()

    return (
        f"===== EVENTSPHERE TICKET =====\n"
        f"Booking ID : #{booking.id}\n"
        f"Ref Code   : {ref}\n"
        f"Event      : {event.title}\n"
        f"Category   : {event.category}\n"
        f"Date       : {event.event_date}\n"
        f"Time       : {event.event_time}\n"
        f"Venue      : {event.location}\n"
        f"Tickets    : {booking.quantity}\n"
        f"Total Paid : Rs.{booking.total_price}\n"
        f"Attendee   : {user.first_name} {user.last_name}\n"
        f"Email      : {user.email}\n"
        f"=============================="
    )


# ─────────────────────────────────────────────
#  HTML BODY
# ─────────────────────────────────────────────

def build_html(booking, qr_cid: str) -> str:
    event  = booking.event
    user   = booking.user

    map_url = (
        event.google_map_link
        or "https://maps.google.com/maps?q=" + event.location.replace(" ", "+")
    )
    fmt_date = (
        event.event_date.strftime("%A, %d %B %Y")
        if hasattr(event.event_date, "strftime") else str(event.event_date)
    )
    fmt_time = (
        event.event_time.strftime("%I:%M %p")
        if hasattr(event.event_time, "strftime") else str(event.event_time)
    )
    tickets_label = f"{booking.quantity} ticket{'s' if booking.quantity > 1 else ''}"

    raw = f"{booking.id}:{event.id}:{user.id}:{booking.booked_at}"
    ref = hashlib.sha256(raw.encode()).hexdigest()[:12].upper()

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Booking Confirmed</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:4px;text-transform:uppercase;">EventSphere Pro</p>
    <h1 style="margin:0;font-size:30px;font-weight:800;color:#fff;">Booking Confirmed!</h1>
    <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Your tickets are locked in. See you at the event!</p>
  </td></tr>

  <!-- GREETING -->
  <tr><td style="background:#1e293b;padding:28px 40px 16px;">
    <p style="margin:0;font-size:15px;color:#cbd5e1;">Hi <strong style="color:#fff;">{user.first_name} {user.last_name}</strong>,</p>
    <p style="margin:10px 0 0;font-size:13px;color:#94a3b8;line-height:1.8;">
      Your booking for <strong style="color:#a78bfa;">{event.title}</strong> is confirmed.
      Your ticket details and unique entry QR code are below.
    </p>
  </td></tr>

  <!-- BOOKING SUMMARY -->
  <tr><td style="background:#1e293b;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:14px;overflow:hidden;">
      <tr><td colspan="2" style="padding:18px 22px;border-bottom:1px solid #334155;background:linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.15));">
        <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Event</p>
        <h2 style="margin:5px 0 0;font-size:18px;font-weight:700;color:#fff;">{event.title}</h2>
        <span style="display:inline-block;margin-top:8px;background:#4f46e5;color:#fff;font-size:10px;font-weight:600;padding:2px 12px;border-radius:20px;">{event.category}</span>
      </td></tr>
      <tr>
        <td style="padding:16px 22px;border-right:1px solid #334155;border-bottom:1px solid #334155;width:50%;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Date</p>
          <p style="margin:5px 0 0;font-size:13px;font-weight:600;color:#e2e8f0;">{fmt_date}</p>
        </td>
        <td style="padding:16px 22px;border-bottom:1px solid #334155;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Time</p>
          <p style="margin:5px 0 0;font-size:13px;font-weight:600;color:#e2e8f0;">{fmt_time}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 22px;border-right:1px solid #334155;border-bottom:1px solid #334155;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Venue</p>
          <p style="margin:5px 0 0;font-size:13px;font-weight:600;color:#e2e8f0;">{event.location}</p>
        </td>
        <td style="padding:16px 22px;border-bottom:1px solid #334155;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Tickets</p>
          <p style="margin:5px 0 0;font-size:13px;font-weight:600;color:#e2e8f0;">{tickets_label}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 22px;border-right:1px solid #334155;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Booking ID</p>
          <p style="margin:5px 0 0;font-size:14px;font-weight:700;color:#a78bfa;">#{booking.id}</p>
        </td>
        <td style="padding:16px 22px;">
          <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Total Paid</p>
          <p style="margin:5px 0 0;font-size:18px;font-weight:800;color:#22c55e;">Rs. {booking.total_price}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- QR CODE — inline CID image, works in Gmail -->
  <tr><td style="background:#1e293b;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:14px;">
      <tr><td style="padding:30px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:3px;">Your Entry QR Code</p>
        <p style="margin:6px 0 20px;font-size:13px;color:#e2e8f0;">Show this at the venue entrance</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:16px;padding:16px;">
          <tr><td>
            <img src="cid:{qr_cid}" alt="Entry QR Code" width="200" height="200" style="display:block;border-radius:8px;"/>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#475569;">
          Booking #{booking.id} &nbsp;&bull;&nbsp; Ref: {ref} &nbsp;&bull;&nbsp; {user.email}
        </p>
      </td></tr>
    </table>
  </td></tr>

  <!-- LOCATION -->
  <tr><td style="background:#1e293b;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:22px;">
        <p style="margin:0 0 4px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Location</p>
        <h3 style="margin:0 0 14px;font-size:15px;color:#fff;">{event.location}</h3>
        <a href="{map_url}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:10px 24px;border-radius:9px;font-size:12px;font-weight:600;">
          Open in Google Maps
        </a>
      </td></tr>
    </table>
  </td></tr>

  <!-- TIPS -->
  <tr><td style="background:#1e293b;padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(79,70,229,0.08);border:1px solid rgba(79,70,229,0.22);border-radius:14px;">
      <tr><td style="padding:22px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#a78bfa;">Tips for the day</p>
        <ul style="margin:0;padding-left:18px;color:#94a3b8;font-size:12px;line-height:2.2;">
          <li>Arrive 15-20 minutes before the event starts.</li>
          <li>Screenshot or print this QR code for quick entry.</li>
          <li>Carry a valid government-issued photo ID.</li>
          <li>Check venue parking availability in advance.</li>
        </ul>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0f172a;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;border-top:1px solid #1e293b;">
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#4f46e5;">EventSphere Pro</p>
    <p style="margin:0;font-size:11px;color:#475569;">Professional Event Management Platform</p>
    <p style="margin:14px 0 0;font-size:10px;color:#334155;">&copy; 2026 EventSphere. All rights reserved.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


# ─────────────────────────────────────────────
#  SEND FUNCTION  (pure stdlib SMTP — no Django mail)
# ─────────────────────────────────────────────

def send_booking_confirmation(booking):
    """
    Send a booking confirmation email with an embedded QR code.

    Builds the MIME tree manually with Python's stdlib so it works on
    Django 6 which removed the undocumented EmailMessage.mixed_subtype hack.

    MIME tree:
        multipart/mixed
          └─ multipart/related
               ├─ text/html   (HTML body referencing cid:)
               └─ image/png   (QR code, Content-ID)
    """
    if not getattr(settings, "EMAIL_HOST_USER", ""):
        logger.warning("EMAIL_HOST_USER not configured — skipping booking email.")
        return

    user  = booking.event and booking.user
    event = booking.event
    user  = booking.user

    qr_cid   = f"qrcode_booking_{booking.id}"
    qr_data  = build_unique_qr_data(booking)
    qr_bytes = generate_qr_bytes(qr_data)
    html_src = build_html(booking, qr_cid)

    subject = f"Booking Confirmed - {event.title} | EventSphere #{booking.id}"

    plain = (
        f"Hi {user.first_name},\n\n"
        f"Your booking for '{event.title}' is confirmed!\n\n"
        f"Booking ID : #{booking.id}\n"
        f"Date       : {event.event_date}\n"
        f"Time       : {event.event_time}\n"
        f"Venue      : {event.location}\n"
        f"Tickets    : {booking.quantity}\n"
        f"Total Paid : Rs. {booking.total_price}\n\n"
        f"Please open the HTML version of this email to see your entry QR code.\n\n"
        f"See you there!\n- EventSphere Team"
    )

    def _build_message():
        # Outer wrapper
        outer = MIMEMultipart("mixed")
        outer["Subject"] = subject
        outer["From"]    = settings.DEFAULT_FROM_EMAIL
        outer["To"]      = user.email

        # Plain-text fallback
        outer.attach(MIMEText(plain, "plain", "utf-8"))

        # multipart/related holds HTML + inline image together
        related = MIMEMultipart("related")

        html_part = MIMEText(html_src, "html", "utf-8")
        related.attach(html_part)

        # Attach QR image with Content-ID so Gmail renders it
        qr_img = MIMEImage(qr_bytes, _subtype="png")
        qr_img.add_header("Content-ID", f"<{qr_cid}>")
        qr_img.add_header(
            "Content-Disposition", "inline",
            filename=f"ticket_qr_{booking.id}.png"
        )
        related.attach(qr_img)

        outer.attach(related)
        return outer

    def _send():
        try:
            msg = _build_message()

            host     = settings.EMAIL_HOST
            port     = settings.EMAIL_PORT
            username = settings.EMAIL_HOST_USER
            password = settings.EMAIL_HOST_PASSWORD
            use_tls  = getattr(settings, "EMAIL_USE_TLS", True)

            if use_tls:
                context = ssl.create_default_context()
                with smtplib.SMTP(host, port) as server:
                    server.ehlo()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(username, password)
                    server.sendmail(username, [user.email], msg.as_string())
            else:
                with smtplib.SMTP_SSL(host, port) as server:
                    server.login(username, password)
                    server.sendmail(username, [user.email], msg.as_string())

            logger.info(f"[EMAIL OK] Booking #{booking.id} sent to {user.email}")
            print(f"[EMAIL OK] Booking #{booking.id} -> {user.email}")

        except Exception as exc:
            logger.error(
                f"[EMAIL FAIL] Booking #{booking.id} -> {user.email}: {exc}",
                exc_info=True,
            )
            print(f"[EMAIL FAIL] Booking #{booking.id}: {exc}")

    threading.Thread(target=_send, daemon=True).start()
