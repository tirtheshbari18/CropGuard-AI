import os
import cv2
import numpy as np

def generate_sample_images():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(os.path.dirname(current_dir))
    demo_dir = os.path.join(backend_dir, "data", "demo")
    os.makedirs(demo_dir, exist_ok=True)
    
    crops = ["tomato", "potato", "apple", "corn"]
    colors = {
        "tomato": (34, 139, 34),
        "potato": (46, 125, 50),
        "apple": (56, 142, 60),
        "corn": (100, 160, 40)
    }
    
    for crop in crops:
        base_color = colors[crop]
        for i in range(1, 4):
            # Create synthetic leaf canvas
            img = np.zeros((450, 450, 3), dtype=np.uint8)
            img[:] = (245, 247, 250) # Light background
            
            # Leaf shape
            cv2.ellipse(img, (225, 225), (140, 190), 15 * i, 0, 360, base_color, -1)
            cv2.ellipse(img, (225, 225), (140, 190), 15 * i, 0, 360, (20, 100, 20), 3)
            
            # Veins
            cv2.line(img, (225, 50), (225, 400), (20, 90, 20), 3)
            cv2.line(img, (225, 150), (140, 100), (20, 90, 20), 2)
            cv2.line(img, (225, 250), (310, 200), (20, 90, 20), 2)
            
            # Disease spots
            if i != 3: # i=3 is healthy
                cv2.circle(img, (180, 180), 25 + i*5, (30, 140, 210), -1)
                cv2.circle(img, (260, 240), 20 + i*4, (40, 120, 190), -1)
                cv2.circle(img, (200, 290), 18 + i*3, (20, 100, 160), -1)
                
            img_name = f"sample_{crop}_{i}.jpg"
            img_path = os.path.join(demo_dir, img_name)
            cv2.imwrite(img_path, img)
            
            # Heatmap overlay
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            heatmap = cv2.applyColorMap(cv2.GaussianBlur(gray, (31, 31), 0), cv2.COLORMAP_JET)
            overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
            
            hm_name = f"heatmap_{crop}_{i}.jpg"
            hm_path = os.path.join(demo_dir, hm_name)
            cv2.imwrite(hm_path, overlay)

    print("Demo leaf images generated successfully!")

if __name__ == "__main__":
    generate_sample_images()
