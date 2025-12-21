import os
import sys
# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.qdrant_service import ingest_chapter
from app.database import SessionLocal
import glob
import re

def parse_mdx(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple parsing to get chapter ID (filename) and text content
    # Remove frontmatter
    content = re.sub(r'^---[\s\S]*?---', '', content)
    # Remove imports/JSX
    content = re.sub(r'import .*?;', '', content)
    content = re.sub(r'<.*?>', '', content)
    
    filename = os.path.basename(file_path)
    chapter_id = filename.replace('.mdx', '').replace('.md', '')
    
    return chapter_id, content.strip()

def main():
    print("Starting ingestion...")
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'frontend', 'docs')
    
    mdx_files = glob.glob(os.path.join(docs_dir, '**/*.mdx'), recursive=True)
    md_files = glob.glob(os.path.join(docs_dir, '**/*.md'), recursive=True)
    all_files = mdx_files + md_files
    
    print(f"Found {len(all_files)} files.")
    
    for file_path in all_files:
        try:
            chapter_id, content = parse_mdx(file_path)
            if content:
                print(f"Ingesting {chapter_id}...")
                ingest_chapter(chapter_id, content)
                print(f"Drafted {chapter_id}")
            else:
                print(f"Skipping empty content for {chapter_id}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    print("Ingestion complete.")

if __name__ == "__main__":
    main()
