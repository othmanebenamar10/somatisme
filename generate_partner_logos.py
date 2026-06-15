#!/usr/bin/env python3
"""
Generate partner logos with green background
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Create brands directory if it doesn't exist
brands_dir = "client/public/brands"
os.makedirs(brands_dir, exist_ok=True)

# Partner data
partners = [
    {"name": "Procter & Gamble", "initials": "PG", "filename": "pg.png"},
    {"name": "Smart Strategies", "initials": "SS", "filename": "Smart-Strategies.png"},
    {"name": "Espace Metal", "initials": "EM", "filename": "Espace-Metal.png"},
    {"name": "Comaprom", "initials": "C", "filename": "Comaprom.png"},
    {"name": "Electroprint", "initials": "E", "filename": "Electroprint.png"},
    {"name": "FATER", "initials": "F", "filename": "FATER.png"},
]

# Colors
GREEN_BG = (34, 197, 94)  # Green-500
WHITE = (255, 255, 255)
DARK_GRAY = (31, 41, 55)

# Image settings
img_size = (400, 400)
border_width = 20

for partner in partners:
    # Create image with green background
    img = Image.new('RGB', img_size, GREEN_BG)
    draw = ImageDraw.Draw(img)
    
    # Add white border
    border_color = WHITE
    draw.rectangle(
        [(border_width, border_width), 
         (img_size[0] - border_width, img_size[1] - border_width)],
        outline=border_color,
        width=3
    )
    
    # Add text (initials or name)
    try:
        # Try to use a bold font
        font = ImageFont.truetype("arial.ttf", 120)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    text = partner["initials"] if len(partner["initials"]) <= 2 else partner["name"][:1]
    
    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (img_size[0] - text_width) // 2
    y = (img_size[1] - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill=WHITE, font=font)
    
    # Save image
    filepath = os.path.join(brands_dir, partner["filename"])
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")

print("\n🎉 All partner logos generated successfully!")
