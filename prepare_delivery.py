
import os
import shutil
import glob

SOURCE_ROOT = r'C:\Users\aksel\OneDrive\Documentos\PYANSA TI\Indicadores\WEB'
DEST_ROOT = os.path.join(SOURCE_ROOT, 'ENTREGABLE_FINAL')

# Define what to ignore
def ignore_patterns(path, names):
    return [n for n in names if n in ['node_modules', '.git', 'dist', 'build', 'coverage', '.env', '.DS_Store', 'target']]

def copy_project(src_rel, dest_rel):
    src = os.path.join(SOURCE_ROOT, src_rel)
    dest = os.path.join(DEST_ROOT, dest_rel)
    
    if os.path.exists(dest):
        shutil.rmtree(dest)
        
    print(f"Copying {src} to {dest}...")
    try:
        shutil.copytree(src, dest, ignore=ignore_patterns)
    except FileNotFoundError:
        print(f"Warning: Source {src} not found. Skipping.")
    except Exception as e:
        print(f"Error copying {src}: {e}")

# Create destination
if not os.path.exists(DEST_ROOT):
    os.makedirs(DEST_ROOT)

# 1. Frontend
copy_project('frontend', 'frontend')

# 2. Microservices (Search & Operations)
copy_project(r'backend\microservices\search-service', 'microservicio-busqueda')
copy_project(r'backend\microservices\operations-service', 'microservicio-operaciones')

# 3. Gateway (Nginx config)
copy_project(r'backend\microservices\gateway', 'api-gateway')

# 4. Orchestration / Extra info
# Copy docker-compose and READMEs to root of deliverable
files_to_copy = ['README.md', 'README_DOCKER.txt', 'GUIA_VPS.txt']
if os.path.exists(os.path.join(SOURCE_ROOT, 'backend', 'docker-compose.yml')):
    shutil.copy2(os.path.join(SOURCE_ROOT, 'backend', 'docker-compose.yml'), os.path.join(DEST_ROOT, 'docker-compose.yml'))

for f in files_to_copy:
    src_f = os.path.join(SOURCE_ROOT, f)
    if os.path.exists(src_f):
        shutil.copy2(src_f, os.path.join(DEST_ROOT, f))

print("✅ Entregable generado exitosamente en ENTREGABLE_FINAL")
