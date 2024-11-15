from flask import Flask, render_template, request, jsonify
import vlc
import pygame
import threading

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
    return render_template('index.html')


@app.route('/send_input', methods=['POST'])
def receive_input():
    global input_text, video_playing
    input_text = request.json.get("email")  # Get the email from JSON data
    PlayVideo('PromoVideo.mp4', False)  # Stop video when input is received
    ShowText(input_text, 'PoppinsFont/Poppins-Regular.ttf', 72, True)

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

def ShowText(TextValue, FontPath, FontSize, ShowTextBoolean):

    global video_playing, input_text, player, screen, pygame_initialized

    if ShowTextBoolean:
        # Initialize PyGame only once
        if not pygame_initialized:
            pygame.init()
            screen_width = 1920
            screen_height = 1080
            screen = pygame.display.set_mode((screen_width, screen_height))
            pygame_initialized = True

        # Load font and render the text
        font = pygame.font.Font(FontPath, FontSize)
        text = font.render(TextValue, True, (255, 255, 255))
        text_rect = text.get_rect(center=(screen.get_width() // 2, screen.get_height() // 2))
        
        # Fill the screen with black and display the text
        screen.fill((0, 0, 0))
        screen.blit(text, text_rect)
        pygame.display.flip()
    else:
        # If ShowTextBoolean is False, quit pygame
        pygame.quit()


if __name__ == '__main__':
    app.run(debug=True)
