from flask import Flask, render_template, request, jsonify
import webbrowser
import vlc
import pygame
import threading
import queue
from datetime import datetime
import cv2
import screeninfo
from screeninfo import get_monitors
import os
from threading import Timer




player = None  # Global variable to control playback
stop_playback = threading.Event()  # Event to signal when playback should stop

app = Flask(__name__)
input_text = None  # Global variable to store user input
video_playing = True  # Flag to control video playback

# Initialize global VLC player and Pygame window once
player = None
screen = None
pygame_initialized = False

@app.route('/')
def home():

    PlayVideo("PromoVideo.mp4", PlayVideoBoolean=True, loop=True, screen=2)
    # ShowText("", input_text, 'PoppinsFont/Poppins-Regular.ttf', 72, False)
    ShowText("", "", "PoppinsFont/Poppins-Regular.ttf", 0, True)


    return render_template('index.html')

def open_browser():
    # Wait a bit for the server to start before opening the browser
    webbrowser.open("http://127.0.0.1:5000")


@app.route('/inputValue', methods=['POST'])
def receive_input():
    global input_text, video_playing
    # Get the field name and value from the JSON data
    field_name = request.json.get("field")
    input_text = request.json.get("value")

    if(field_name == "FirstName"):
        field_name = "First Name"
    elif(field_name == "LastName"):
        field_name = "Last Name"
    elif(field_name == "companyInput"):
        field_name = "Company Name"
    elif(field_name == "email"):
        field_name = "Email"
    elif(field_name == "phone"):
        field_name = "Phone Number"
        input_text = str(input_text)
    
        # Check if the length of the phone number is greater than 3
        if len(input_text) > 3:
            # Hide the middle part of the number with asterisks
            hidden_part = '*' * (len(input_text) - 6)  # Calculate how many asterisks to add
            input_text =  input_text[:3] + hidden_part + input_text[-3:]  # Concatenate parts            
    
    elif(field_name == "IDType"):
        field_name = "ID Type"
    elif(field_name == "checkin"):
        field_name = "Check-in Date"
        input_text = datetime.strptime(input_text, "%Y-%m-%dT%H:%M")
        input_text = input_text.strftime("%B %d , %Y at %I:%M %p")

    elif(field_name == "checkout"):
        field_name = "Check-out Date"
        input_text = datetime.strptime(input_text, "%Y-%m-%dT%H:%M")
        input_text = input_text.strftime("%B %d , %Y at %I:%M %p")
    elif(field_name == "RoomService"):
        field_name = "Room Service"
    elif(field_name == "Kitchen"):
        field_name = "Kitchen"
    elif(field_name == "roomType"):
        field_name = "Room Type"
    elif(field_name == "roomName"):
        field_name = "Room Name"

    PlayVideo('PromoVideo.mp4', False)  # Stop video when input is received
    ShowText(f"{field_name}:", input_text, 'PoppinsFont/Poppins-Regular.ttf', 72, True)
    return jsonify({"status": "success"})



def PlayVideo(VideoPath, PlayVideoBoolean, loop=False, screen=1):
    """
    Plays or stops the video depending on the PlayVideoBoolean flag.
    If `loop` is True, the video will loop continuously.
    Displays the video on the specified screen.
    Args:
        VideoPath (str): Path to the video file.
        PlayVideoBoolean (bool): True to play the video, False to stop it.
        loop (bool): True to loop the video playback.
        screen (int): Screen number (1 for primary, 2 for secondary, etc.).
    """
    global player, stop_playback

    def get_screen_resolution(screen_number):
        """
        Get the resolution of the specified screen using the screeninfo library.
        """
        screens = screeninfo.get_monitors()
        if screen_number <= len(screens):
            return screens[screen_number - 1]
        else:
            print("Invalid screen number, defaulting to the first screen.")
            return screens[0]

    def play():
        global player
        stop_playback.clear()  # Clear the stop signal
        player = cv2.VideoCapture(VideoPath)

        # Get screen resolution for the specified screen
        screen_info = get_screen_resolution(screen)
        offset_x = screen_info.x
        offset_y = screen_info.y

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
            # Move the window to the specified screen
            cv2.moveWindow("Video Playback", offset_x, offset_y)

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


# Global variables for PyGame
pygame_initialized = False
screen = None
pygame_thread = None
text_queue = queue.Queue()
running = False
lock = threading.Lock()  # To manage thread safety when updating global variables


def get_screen_position(screen_number):
    """
    Get the position and resolution of the specified screen.
    """
    monitors = get_monitors()
    if screen_number <= len(monitors):
        return monitors[screen_number - 1]
    else:
        print("Invalid screen number, defaulting to the primary screen.")
        return monitors[0]


def pygame_loop(screen_number=2):
    """
    A persistent PyGame loop that listens for updates from the text queue.
    """
    global pygame_initialized, screen, running

    # Get screen position and resolution
    screen_info = get_screen_position(screen_number)
    os.environ['SDL_VIDEO_WINDOW_POS'] = f"{screen_info.x},{screen_info.y}"

    # Initialize PyGame
    pygame.init()
    screen_width, screen_height = screen_info.width, screen_info.height
    screen = pygame.display.set_mode((screen_width, screen_height), pygame.NOFRAME)
    pygame.display.set_caption("Display on Second Screen")
    pygame_initialized = True
    running = True

    font_title = None
    font_text = None
    current_title = ""
    current_text = ""

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                pygame.quit()
                return

        # Check for new text or updates from the queue
        try:
            inputTitle, TextValue, FontPath, FontSize = text_queue.get_nowait()
            font_title = pygame.font.Font(FontPath, int(FontSize * 1.2))  # Larger font for the title
            font_text = pygame.font.Font(FontPath, FontSize)
            current_title = inputTitle
            current_text = TextValue
        except queue.Empty:
            pass

        # Render the title and text
        screen.fill((0, 0, 0))
        if font_title and font_text:
            # Render the title
            title_surface = font_title.render(current_title, True, (255, 255, 0))  # Yellow color for the title
            title_rect = title_surface.get_rect(center=(screen_width // 2, screen_height // 2 - 50))
            screen.blit(title_surface, title_rect)

            # Render the main text
            text_surface = font_text.render(current_text, True, (255, 255, 255))
            text_rect = text_surface.get_rect(center=(screen_width // 2, screen_height // 2 + 50))
            screen.blit(text_surface, text_rect)

        pygame.display.flip()
        pygame.time.delay(100)

    # Reset global state when loop exits
    with lock:
        pygame_initialized = False
        screen = None


def ShowText(inputTitle, TextValue, FontPath, FontSize, ShowTextBoolean, screen_number=2):
    global pygame_thread, text_queue, running

    if ShowTextBoolean:
        with lock:
            # Start PyGame loop if not already running
            if not pygame_thread or not pygame_thread.is_alive():
                running = True
                pygame_thread = threading.Thread(target=pygame_loop, args=(screen_number,), daemon=True)
                pygame_thread.start()

        # Send updates to the PyGame loop
        text_queue.put((inputTitle, TextValue, FontPath, FontSize))
    else:
        with lock:
            # Stop the PyGame loop
            running = False
            if pygame_thread and pygame_thread.is_alive():
                pygame_thread.join()


# Example Usage
# ShowText("Hello World", "This is displayed on the second screen!", "arial.ttf", 30, True, screen_number=2)

# Stop the text display after some time





if __name__ == "__main__":
    # Launch the browser after a short delay
    Timer(1, open_browser).start()
    app.run(debug=True)
