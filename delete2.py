import cv2
import threading
import ctypes

player = None  # Global variable to control playback
stop_playback = threading.Event()  # Event to signal when playback should stop


def PlayVideo(VideoPath, PlayVideoBoolean, loop=False, screen=1):
    """
    Plays or stops the video depending on the PlayVideoBoolean flag.
    If `loop` is True, the video will loop continuously.
    Displays the video on the specified screen.
    Args:
        VideoPath (str): Path to the video file.
        PlayVideoBoolean (bool): True to play the video, False to stop it.
        loop (bool): True to loop the video playback.
        screen (int): Screen number (1 for primary, 2 for secondary).
    """
    global player, stop_playback

    def get_screen_resolution(screen_number):
        """
        Get the resolution of the specified screen.
        """
        user32 = ctypes.windll.user32
        user32.SetProcessDPIAware()
        screens = [
            (user32.GetSystemMetrics(78), user32.GetSystemMetrics(79)),  # Screen 1
            (user32.GetSystemMetrics(118), user32.GetSystemMetrics(79)),  # Screen 2
        ]
        return screens[screen_number - 1]

    def play():
        global player
        stop_playback.clear()  # Clear the stop signal
        player = cv2.VideoCapture(VideoPath)

        # Get screen resolution for the specified screen
        try:
            resolution = get_screen_resolution(screen)
            offset_x = resolution[0] if screen == 2 else 0
        except IndexError:
            print("Invalid screen number. Defaulting to primary screen.")
            offset_x = 0

        while player.isOpened():
            ret, frame = player.read()
            if not ret:
                if loop:  # Restart the video if looping is enabled
                    player.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                else:
                    break

            # Display the video
            cv2.imshow("Video Playback", frame)
            cv2.moveWindow("Video Playback", offset_x, 0)  # Move the window to the desired screen

            if cv2.waitKey(30) & 0xFF == ord('q') or stop_playback.is_set():
                break

        player.release()
        cv2.destroyAllWindows()
        player = None  # Reset the player

    if PlayVideoBoolean:
        if player is None:  # Only start playback if not already running
            threading.Thread(target=play, daemon=True).start()  # Run in a separate thread
    else:
        stop_playback.set()  # Signal the playback loop to stop


# Example Usage
# Play the video on the second screen (screen=2)
PlayVideo("PromoVideo.mp4", PlayVideoBoolean=True, loop=True, screen=2)

# Stop the video
# PlayVideo("path/to/video.mp4", PlayVideoBoolean=False)
