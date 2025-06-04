# 🚗 Three.js Ground Projected Environment Mapping – My Learning Journey

This project is a hands-on exploration and extension of advanced environment mapping in [Three.js](https://threejs.org/), featuring a ground-projected HDR skybox, a custom 3D car model(Ford Fusion in this case), and real-time height and radius controls.  
It started as a personal challenge to replicate and understand the [threejs.org ground projected environment mapping demo](https://threejs.org/examples/webgl_materials_envmaps_groundprojected.html), but evolved into a deep learning experience and a showcase of my growth as a developer.

---

## 🌟 Project Highlights

- **Ground-projected HDR skybox** (custom Three.js class for custom mesh)
- **Real-time dynamic shadow** (no fake/baked shadow!)
- **Interactive GUI** for environment controls
- **Custom car model** and easy asset swapping
- **Custom HDRI** and easy HDRI-Lighting swapping
- **Modern, responsive UI**
- **Well-documented, modular code**

---

## 🎯 Why I Built This

I wanted to:
- **Learn by doing:** Go beyond copying, and really understand how Three.js advanced environment mapping works.
- **Challenge myself:** to build, debug, and customize a real-world 3D feature.
- **Create:** Something that would teach me about real 3D graphics workflows.

---

## 🛠️ My Learning Experience

### **1. From Copying to Understanding**
- I started by trying to replicate the official Three.js example, just to understand it clearly. I quickly realized that just copying code wasn’t enough—I needed to understand every part, from imports to custom classes. Used Perplexity.ai for this, which helped me throughout the journey.

### **2. Facing (and Solving) Real Problems**
- **Missing files:** The official example uses internal files not available on CDN, so I learned how to find, download, and adapt code from the Three.js GitHub repo.
- **Custom geometry:** The `GroundedSkybox` class warps a sphere into a ground plane. I learned how to manipulate geometry buffers and why this math matters.
- **Async loading:** I encountered issues with asset loading order and fixed them using `async/await` and Promises for HDR and model loading.
- **Dynamic updates:** Making the skybox’s height and radius update in real time required adding setters and geometry recreation.
- **Real-time shadows:** I replaced the baked shadow with a true shadow using `THREE.ShadowMaterial` and learned about the visual tradeoffs of different shadow approaches.
- **GUI vs. custom UI:** I explored using lil-gui for rapid prototyping, else would have build my own controls with HTML/CSS/JS for more customization.

### **3. Debugging and Iteration**
- I faced errors like missing uniforms, undefined variables, and shadow artifacts. Each was a learning opportunity.
- I learned to use logging, browser dev tools, and careful incremental changes to solve problems.

### **4. Growth in Confidence**
- I moved from feeling “ashamed” of copying, to being able to explain, extend, and teach what I built.
- I realized that open source and learning is about building on others’ work, but making it your own by understanding and improving it.

---

## 💡 What Makes This Project Unique

- **Real dynamic shadow**: Unlike the official demo (which uses a baked shadow texture), my version uses true Three.js shadow mapping, with options to blend it with the HDR ground for realism.
- **Customizable controls**: Height and radius of the skybox can be changed live, and the ground/shadow can be toggled.
- **Modular and readable code**: All logic is split into clear functions and custom classes, with comments and error handling.
- **Learning-first README**: This file documents not just the code, but the entire journey and what I learned.

---

## 📚 What I Learned

- **Three.js fundamentals**: Scene, camera, mesh, material, geometry, lighting, shadow.
- **Advanced environment mapping**: Using HDRIs for realistic lighting and reflections.
- **Geometry manipulation**: Warping a sphere to create a seamless ground projection.
- **Async/await and Promises**: For asset loading and error handling.
- **Shadow mapping**: The difference between baked, fake, and real-time shadows, and how to implement each.
- **UI/UX for 3D**: Using lil-gui and custom controls to make interactive demos.
- **Debugging and problem solving**: How to read errors, use dev tools, and find solutions.
- **Open source best practices**: Documentation, attribution, and honest reflection on what’s original and what’s adapted.
- **HTTRACK fundamentals**

---

## 🧩 How This Differs From the Official Three.js Example

- **No hidden/internal files**: Everything is in the repo, with instructions for setup.
- **Real shadow, not a texture**: The shadow is dynamic and interacts with the model and light.
- **Fully modular and documented**: Every function and class is explained.
- **Personal learning journey**: This README is as much about the process as the product.

---

## 🚀 How to Run

### **Prerequisites**
- Modern web browser
- Local HTTP server (e.g., `python -m http.server` or VS Code Live Server)


### **Steps**
1. Clone or download this repository.
2. Make sure all assets (car model, HDR) are in the correct folders.
3. Start a local server in the project directory:
   - With Python: `python -m http.server`
   - Or use VS Code Live Server
4. Open `http://localhost:8000` in your browser.


## Assets

To run this project, place the required assets  in the `Assets/` folder as follows:

- `Assets/textures/equirectangular/environmentTexture.hdr`
- `Assets/models/gltf/car.glb`
- etc.

**Note:** The `Assets/` folder is excluded from version control to keep the repository lightweight.

EDIT: I have now added the essential assets after compressing them, so that the live link works


---

## 📝 Credits & Attribution

- **Three.js** ([threejs.org](https://threejs.org/))
- **HDRI:** [Blouberg Sunrise 2](https://polyhaven.com/a/blouberg_sunrise_2) by [Greg Zaal](https://gregzaal.com/)
- **Car model:** Ford Fusion [2006-2010]
- **Inspiration:** [Three.js ground projected environment mapping example](https://threejs.org/examples/webgl_materials_envmaps_groundprojected.html)
- **Thanks to:** The open source community and everyone who shares their code and knowledge.

---

## 🏁 Final Thoughts

This project started as a copy, but became my own through problem-solving, learning, and customization.  
If you’re just starting out: it’s okay to copy, but always try to understand, explain, and improve what you build.  
If you use or adapt this, please credit the original sources, and share what you learned too!

---

## Live LINK
https://hariom57.github.io/realshadow-grounded-threejs/
