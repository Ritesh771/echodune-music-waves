import os
from django.core.management.base import BaseCommand
from echodune.settings import BASE_DIR
from auth_app.models import Song
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, APIC
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings

class Command(BaseCommand):
    help = 'Import songs from echodune/media/songs/ and extract metadata and cover images.'

    def handle(self, *args, **options):
        music_dir = os.path.join(BASE_DIR, 'media', 'songs')
        if not os.path.exists(music_dir):
            self.stdout.write(self.style.ERROR(f"Music directory not found: {music_dir}"))
            return

        for filename in os.listdir(music_dir):
            if not filename.lower().endswith('.mp3'):
                continue
            file_path = os.path.join(music_dir, filename)
            try:
                audio = MP3(file_path, ID3=ID3)
                tags = audio.tags
                title = tags.get('TIT2').text[0] if tags.get('TIT2') else os.path.splitext(filename)[0]
                artist = tags.get('TPE1').text[0] if tags.get('TPE1') else 'Unknown Artist'
                album = tags.get('TALB').text[0] if tags.get('TALB') else ''
                duration = audio.info.length
                # Check for cover art
                cover_image_rel = None
                if tags:
                    for tag in tags.values():
                        if isinstance(tag, APIC):
                            ext = tag.mime.split('/')[-1]
                            cover_filename = f"{os.path.splitext(filename)[0]}_cover.{ext}"
                            cover_path = os.path.join(settings.MEDIA_ROOT, 'covers', cover_filename)
                            os.makedirs(os.path.dirname(cover_path), exist_ok=True)
                            with open(cover_path, 'wb') as img_out:
                                img_out.write(tag.data)
                            cover_image_rel = f"covers/{cover_filename}"
                            break

                # Save Song object
                song_obj, created = Song.objects.get_or_create(
                    title=title,
                    artist=artist,
                    album=album,
                    defaults={
                        'duration': duration,
                        'file': f"songs/{filename}",
                        'cover_image': cover_image_rel,
                    }
                )
                if not created:
                    # Update file, cover, duration if needed
                    song_obj.duration = duration
                    song_obj.file = f"songs/{filename}"
                    if cover_image_rel:
                        song_obj.cover_image = cover_image_rel
                    song_obj.save()
                self.stdout.write(self.style.SUCCESS(f"Imported: {title} - {artist}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to import {filename}: {e}")) 