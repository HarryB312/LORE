from PIL import Image, ImageDraw, ImageFont
import os

def generate_lore_icon():
    # Size for a high-quality icon
    size = (512, 512)
    # Professional dark theme (matching the app)
    bg_color = (15, 23, 42)  # Slate 900
    text_color = (129, 140, 248)  # Indigo 400
    
    # Create image
    img = Image.new('RGBA', size, bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to find a nice font, fallback to default
    font_size = 180
    font = None
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf",  # Arial Bold
        "C:\\Windows\\Fonts\\segoeuib.ttf", # Segoe UI Bold
        "C:\\Windows\\Fonts\\verdana.ttf"   # Verdana
    ]
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except:
                continue
    
    if not font:
        font = ImageFont.load_default()

    # Draw "LORE" text
    text = "LORE"
    # Get text bounding box to center it
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    
    # Center position
    pos = ((size[0] - w) // 2, (size[1] - h) // 2 - 20)
    
    # Add a slight glow effect (very simple)
    draw.text((pos[0]+2, pos[1]+2), text, font=font, fill=(0, 0, 0, 100))
    draw.text(pos, text, font=font, fill=text_color)
    
    # Add a small underline or accent
    accent_color = (99, 102, 241) # Indigo 500
    draw.rectangle([pos[0] + 10, pos[1] + h + 10, pos[0] + w - 10, pos[1] + h + 25], fill=accent_color)

    # Save as ICO (multiple sizes)
    icon_path = os.path.join("..", "lore_icon.ico")
    img.save(icon_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Icon created successfully at: {os.path.abspath(icon_path)}")

if __name__ == "__main__":
    generate_lore_icon()
