import os
import re

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                
                # Replace text-white with text-[#fff] when it's near a brand background
                # This ensures brand buttons always have white text even in dark mode
                new_content = re.sub(r'bg-\[var\(--color-brand\)\](.*?)text-white', r'bg-[var(--color-brand)]\1text-[#fff]', new_content)
                new_content = re.sub(r'text-white(.*?)bg-\[var\(--color-brand\)\]', r'text-[#fff]\1bg-[var(--color-brand)]', new_content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

project_root = r"c:\Users\samar\Downloads\ttt-project\ttt"
process_directory(os.path.join(project_root, "app"))
process_directory(os.path.join(project_root, "components"))
process_directory(os.path.join(project_root, "lib"))
print("Done!")
