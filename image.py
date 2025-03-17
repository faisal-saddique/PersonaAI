import base64

def convert_jpg_to_base64(image_path, output_txt_path):
    with open(image_path, "rb") as image_file:
        base64_data = base64.b64encode(image_file.read()).decode("utf-8")
        base64_url = f"data:image/jpeg;base64,{base64_data}"
    
    with open(output_txt_path, "w") as txt_file:
        txt_file.write(base64_url)
    
    print(f"Base64 URL saved to {output_txt_path}")

# Example usage:
convert_jpg_to_base64("public/emma.jpg", "output.txt")
