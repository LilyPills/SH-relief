# SH Relief

The **SH Relief application** was designed not just as a technical interactive art piece, but as a harm-reduction tool aimed at helping people who struggle with self-harm urges.

The core idea behind the project is to provide a visual and sensory substitute for the act of cutting, without causing any physical injury. By simulating incisions and bleeding in a controlled, digital environment, the application offers a way for users to externalize and process intense emotions or cravings in a safer manner.

For some individuals, self-harm behaviors are linked to overwhelming emotional states, dissociation, or the need for visual confirmation of pain. SH Relief attempts to redirect that urge into an interactive simulation that preserves the visual and kinetic aspects — such as drawing a line and seeing a reactive result — while eliminating physical harm.

The intention is not to romanticize or encourage self-harm, but to:

Offer a temporary coping mechanism during moments of crisis
Provide a safer alternative during high-urge episodes
Create a sense of control through interaction
Serve as a bridge toward healthier coping strategies

It is important to emphasize that the application is not a replacement for professional mental health support, but rather a complementary harm-reduction tool that may help reduce immediate risk.

---

### 1. What is the application?

Alivio turns the mouse (or screen touch) into an incision tool. By clicking and dragging, the user creates realistic cuts that bleed dynamically. The purpose is purely visual and simulative, offering a tactile and organic experience.



### 2. Main Visual Features

**Lenticular Cuts:**
Instead of simple lines, the cuts have a “lenticular” shape (similar to an eye or a leaf), being extremely thin at the ends and slightly more open in the center.

**Stroke Smoothing:**
The application uses smoothing algorithms (weighted averages) to ensure that the curves of the cuts are rounded and organic, even if the mouse movement is fast or shaky.

**Realistic (Bulbous) Bleeding:**
The blood is not just a static line. It flows with a rounded “head” (thicker) that leaves a slightly thinner trail (neck) behind it, mimicking the surface tension of a real liquid.

**High Intensity:**
Each incision generates multiple blood streams that flow independently and at varying speeds, creating an intense bleeding effect.

**Full Persistence:**
Everything that is drawn — both the cuts and the flowing blood — remains on the screen indefinitely, allowing the canvas to be filled with the marks of interaction.



### 3. Technology Used

The application was built from scratch, without external libraries, ensuring lightness and performance:

**HTML5 Canvas:**
Used to render thousands of blood pixels and complex geometric shapes at 60 frames per second.

**Offscreen Buffering:**
To prevent slowdowns as more cuts are added, an “invisible canvas” stores the permanent image state, while the main canvas handles only active animations.

**Vanilla JavaScript:**
All blood physics logic, normal calculations for the cut shape, and interaction events were written in pure JS.



### 4. How to Interact

**Click and Drag:** Creates a cut along the mouse path. <br>
**The longer the stroke:** The more blood will be generated along the incision.<br>
**Touch:** Works perfectly on mobile devices (phones and tablets).
**Clear Screen Functionality:** Press the button to a clear the screen.

---

Please, take care of yourself! <3
