import trimesh

# Load the .glb file
mesh = trimesh.load("FullBody.glb")

# Set the background color (it can be done through the scene)
mesh.show(background=[0, 0, 0], 
    background_color=[0, 0, 0],
    window_size=[1920, 1080],
    ##Camera
    camera_target=[678, 560, 0],
    show_ui=False,
    show_axes=False,
    show_grid=False,
    show_bounds=False,
    show_edges=False,
    show_faces=False,
    show_wireframe=False
    
    ) 


