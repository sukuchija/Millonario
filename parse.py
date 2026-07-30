import re
import json
import os

def parse_questions():
    with open('../questions.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    blocks = text.split('¿')
    questions = []

    categories = [
        {"name": "Historia", "color": "#FFD700", "count": 14},
        {"name": "Arte y Cultura", "color": "#9b59b6", "count": 18},
        {"name": "Ciencia y Naturaleza", "color": "#2ecc71", "count": 18},
        {"name": "Geografía", "color": "#3498db", "count": 18},
        {"name": "Deportes", "color": "#e67e22", "count": 18},
        {"name": "Entretenimiento", "color": "#ff6b81", "count": 15}
    ]

    q_idx = 0

    for block in blocks:
        if not block.strip(): continue
        block = "¿" + block
        
        # Replace newlines with spaces for easier regex matching
        clean_block = block.replace('\n', ' ')
        # Clean up double spaces
        clean_block = re.sub(r'\s+', ' ', clean_block)
        
        match = re.search(r'(¿.*?)\s*A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*)', clean_block)
        if match:
            q_text = match.group(1).strip()
            opt_a = match.group(2).strip()
            opt_b = match.group(3).strip()
            opt_c = match.group(4).strip()
            
            # Determine category based on index
            cat = categories[-1]
            c_count = 0
            for c in categories:
                c_count += c['count']
                if q_idx < c_count:
                    cat = c
                    break
                    
            questions.append({
                "id": q_idx + 1,
                "category": cat["name"],
                "color": cat["color"],
                "question": q_text,
                "options": [
                    {"label": "A", "text": opt_a},
                    {"label": "B", "text": opt_b},
                    {"label": "C", "text": opt_c}
                ]
            })
            q_idx += 1

    os.makedirs('src/data', exist_ok=True)
    with open('src/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
        
    print(f"Parsed {len(questions)} questions")

if __name__ == '__main__':
    parse_questions()
