from flask import Flask, render_template, request, jsonify
import vlc
import pygame
import threading
import queue
from datetime import datetime


app = Flask(__name__)
input_text = None  # Global variable to store user input
video_playing = True  # Flag to control video playback

# Initialize global VLC player and Pygame window once
player = None
screen = None
pygame_initialized = False

@app.route('/')
def home():
    PlayVideo('PromoVideo.mp4', True)  # Start video playback on start
    ShowText("", input_text, 'PoppinsFont/Poppins-Regular.ttf', 72, False)

    return render_template('index.html')


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



def PlayVideo(VideoPath, PlayVideoBoolean):
    """
    Plays or stops the video depending on the PlayVideoBoolean flag.
    Runs the video playback in a separate thread to prevent blocking.
    """
    global player
    if PlayVideoBoolean:
        if player is None:  # Initialize player if not already initialized
            player = vlc.MediaPlayer(VideoPath)
        def play():
            player.play()
        threading.Thread(target=play).start()  # Run the video in a separate thread
    else:
        if player is not None:
            player.stop()

# Define global variables
pygame_initialized = False
screen = None  # Placeholder for the screen object



# Global variables for PyGame
pygame_initialized = False
screen = None
pygame_thread = None
text_queue = queue.Queue()
running = False

def pygame_loop():
    """
    A persistent PyGame loop that listens for updates from the text queue.
    """
    global pygame_initialized, screen, running

    # Initialize PyGame
    pygame.init()
    screen_width = 1920
    screen_height = 1080
    screen = pygame.display.set_mode((screen_width, screen_height))
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
            # Retrieve updates from the queue
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
            title_rect = title_surface.get_rect(center=(screen.get_width() // 2, screen.get_height() // 2 - 50))  # Position above main text
            screen.blit(title_surface, title_rect)

            # Render the main text
            text_surface = font_text.render(current_text, True, (255, 255, 255))
            text_rect = text_surface.get_rect(center=(screen.get_width() // 2, screen.get_height() // 2 + 50))  # Position below the title
            screen.blit(text_surface, text_rect)

        pygame.display.flip()
        pygame.time.delay(100)  # Control frame rate


def ShowText(inputTitle, TextValue, FontPath, FontSize, ShowTextBoolean):
    global pygame_thread, text_queue, running

    if ShowTextBoolean:
        # Start PyGame loop if not already running
        if not pygame_thread or not pygame_thread.is_alive():
            pygame_thread = threading.Thread(target=pygame_loop, daemon=True)
            pygame_thread.start()

        # Send updates to the PyGame loop
        text_queue.put((inputTitle, TextValue, FontPath, FontSize))
    else:
        # Stop the PyGame loop
        running = False
        if pygame_thread and pygame_thread.is_alive():
            pygame_thread.join()




if __name__ == '__main__':
    app.run(debug=True)
