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
                # Replace shadow-[..._black] with shadow-[..._var(--color-ink)]
                new_content = re.sub(r'shadow-\[([^\]]+)_black\]', r'shadow-[\1_var(--color-ink)]', new_content)
                
                # Replace #1a1a1a with black
                # But careful, some might be in arbitrary values like bg-[#1a1a1a] -> bg-black
                new_content = re.sub(r'bg-\[#1a1a1a\]', r'bg-black', new_content)
                new_content = re.sub(r'text-\[#1a1a1a\]', r'text-black', new_content)
                new_content = re.sub(r'border-\[#1a1a1a\]', r'border-black', new_content)

                # Replace #111 with black
                new_content = re.sub(r'bg-\[#111\]', r'bg-black', new_content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

project_root = r"c:\Users\samar\Downloads\ttt-project\ttt"
process_directory(os.path.join(project_root, "app"))
process_directory(os.path.join(project_root, "components"))
process_directory(os.path.join(project_root, "lib"))
print("Done!")
