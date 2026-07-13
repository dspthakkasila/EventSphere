import random
from datetime import date, timedelta, time

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.events.models import Event


class Command(BaseCommand):
    help = "Seed 30 demo events"

    def handle(self, *args, **kwargs):

        organizer = User.objects.first()

        if not organizer:
            self.stdout.write(self.style.ERROR("No users found."))
            return

        Event.objects.all().delete()

        events = [

            ("AI & Machine Learning Summit","Technology","Hyderabad"),
            ("React India Conference","Technology","Bangalore"),
            ("Startup Pitch Night","Business","Hyderabad"),
            ("Full Stack Bootcamp","Workshop","Chennai"),
            ("Cloud Computing Expo","Technology","Pune"),
            ("Cyber Security Summit","Technology","Delhi"),
            ("Music Fiesta Live","Music","Mumbai"),
            ("Startup Networking Meetup","Business","Bangalore"),
            ("National Sports Expo","Sports","Delhi"),
            ("Career Guidance Fair","Education","Kurnool"),
            ("Python Developers Meetup","Technology","Hyderabad"),
            ("Flutter Connect","Technology","Bangalore"),
            ("DevOps World","Technology","Pune"),
            ("Women in Tech","Technology","Hyderabad"),
            ("Data Science Conference","Technology","Chennai"),
            ("Blockchain Summit","Technology","Mumbai"),
            ("Photography Workshop","Workshop","Goa"),
            ("Digital Marketing Masterclass","Business","Hyderabad"),
            ("Food Carnival","Business","Vizag"),
            ("Gaming Championship","Technology","Bangalore"),
            ("Hackathon 2026","Technology","Hyderabad"),
            ("Finance Leadership Summit","Business","Mumbai"),
            ("Yoga & Wellness Camp","Sports","Mysore"),
            ("UI UX Design Conference","Technology","Hyderabad"),
            ("AI Startup Expo","Technology","Hyderabad"),
            ("Robotics Challenge","Technology","Chennai"),
            ("National Coding Contest","Technology","Delhi"),
            ("Entrepreneurship Bootcamp","Business","Bangalore"),
            ("International Education Expo","Education","Hyderabad"),
            ("Future Tech Innovation Summit","Technology","Hyderabad"),

        ]

        banner_images = [

            "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
            "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1200",
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200",

        ]

        descriptions = [

            "Join industry experts for an unforgettable event packed with networking, workshops and inspiring talks.",

            "A premium conference designed for professionals and students to learn cutting-edge technologies.",

            "Experience keynote sessions, live demos, hands-on workshops and networking opportunities."

        ]

        for i, item in enumerate(events):

            Event.objects.create(

                organizer=organizer,

                title=item[0],

                description=random.choice(descriptions),

                category=item[1],

                banner_url=random.choice(banner_images),

                location=item[2],

                google_map_link=f"https://maps.google.com/?q={item[2]}",

                event_date=date.today()+timedelta(days=i+3),

                event_time=time(10,0),

                total_seats=random.randint(300,1200),

                available_seats=random.randint(150,800),

                price=random.randint(199,1499),

                rating=round(random.uniform(4.3,5.0),1),

                status="Upcoming",

                is_featured=random.choice([True,False])

            )

        self.stdout.write(
            self.style.SUCCESS("30 Events Created Successfully")
        )