import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function to convert base64 to Gemini format
function fileToGenerativePart(base64Data: string, mimeType: string) {
    return {
        inlineData: {
            data: base64Data.split(',')[1], // Remove data:image/xxx;base64, prefix
            mimeType,
        },
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tabType, influencerData, ...data } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Chave API do Gemini não configurada" },
                { status: 500 }
            );
        }

        // Initialize the model (using Gemini 2.5 Flash as explicitly requested)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = "";
        let imageParts: any[] = [];
        let finalPrompt = "";

        // Handle different tab types
        switch (tabType) {
            case "influencer": {
                const { gender, age, ethnicity, hairColor, eyeColor, location, extraDetails, referencePhoto } = data;

                if (!gender || !age || !ethnicity || !hairColor || !eyeColor) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos obrigatórios" },
                        { status: 400 }
                    );
                }

                // Generate high-fidelity JSON via Gemini to ensure translation and stereotype breaking
                const influencerPrompt = `
                ACT AS A WORLD-CLASS AI PROMPT ENGINEER.
                Create a high-fidelity JSON profile for an influencer focused on EXTREME REALISM (Anti-AI look).

                **MANDATORY CONSTRAINTS:**
                - Gender: "${gender}" (MUST be respected)
                - Age: "${age}" (Visual age approximation)
                - Ethnicity: "${ethnicity}" (STRICT ADHERENCE REQUIRED)
                - Hair: "${hairColor}" (OVERRIDE ANY ETHNICITY STEREOTYPES. E.g. If Asian + Blonde, generate Asian with Blonde hair.)
                - Eyes: "${eyeColor}"
                - Location: "${location || "random"}"
                - Details: "${extraDetails || "None"}"
                - Reference Photo: ${referencePhoto ? "Yes - Extract features from image" : "No - Use description only"}

                **TASK:**
                Generate a high-fidelity JSON object for image generation.
                translate ALL Portuguese terms to English visual descriptors.

                **STRATEGY - THE "ANTI-PLASTIC" PROTOCOL:**
                1.  **TEXTURE IS KING:** You MUST emphasize skin texture, pores, vellus hair, and natural imperfections.
                2.  **LIGHTING IMPERFECTION:** Avoid perfect studio lighting. Use terms like "harsh sunlight", "mixed lighting", "flash photography" if appropriate.
                3.  **BREAK THE AI LOOK:** Avoid "smooth", "perfect", "symmetrical".
                5.  **STRUCTURAL VARIETY (CRITICAL):**
                    - DO NOT GENERATE THE SAME GENERIC FACE.
                    - RANDOMLY SELECT a specific face shape (Square, Oval, Heart, Diamond, Round).
                    - RANDOMLY SELECT a specific nose shape (Roman, Button, Nubian, Aquiline, Snub).
                    - RANDOMLY SELECT specific jawline (Sharp, Soft, Square).

                **JSON STRUCTURE:**
                {
                    "image_type": "portrait",
                    "style": "Raw Flash Photography / Editorial",
                    "realism_level": "Analog Film aesthetic, Fujifilm GFX 100",
                    "subject": {
                        "gender": "...",
                        "age": "...",
                        "ethnicity": "...",
                        "features_description": "...",
                        "hair": {
                            "color": "...",
                            "style": "messy/natural flow",
                            "physics": "wind blown / gravity affected",
                            "texture": "frizzy strands / individual hairs visible"
                        },
                        "eyes": {
                            "color": "...",
                            "style": "visible capillaries, natural moisture, not glowing"
                        },
                        "skin_texture": {
                            "style": "Hyper-detailed raw skin",
                            "details": ["visible pores", "vellus hair (peach fuzz)", "slight sweat/oil", "sun spots", "natural redness"]
                        },
                        "face": {
                            "shape": "MUST BE SPECIFIC (e.g. 'sharp diamond face' or 'soft round face')",
                            "nose": "MUST BE SPECIFIC (e.g. 'prominent aquiline nose' or 'small button nose')",
                            "lips": "MUST BE SPECIFIC (e.g. 'full cupids bow' or 'thin expressive lips')",
                            "proportions": "natural asymmetry (one eye slightly smaller/lower)",
                            "expression": "candid, non-posed look"
                        },
                        // Add makeup if female, grooming if male (but keep it realistic, e.g. "mascara clumps" or "stubble")
                    },
                    "environment": {
                        "background": "... (Use the Location/Setting input. Add clutter/mess/real world elements)",
                        "lighting": {
                            "type": "Natural / Practical sources",
                            "style": "Hard shadows, dynamic range, not flat"
                        }
                    },
                    "camera": {
                        "sensor": "35mm Film Grain / Kodak Portra 400",
                        "lens": "50mm Prime",
                        "quality": "chromatic aberration, motion blur (slight)"
                    }
                }

                **IMPORTANT:**
                - JSON ONLY. No markdown, no intro.
                - Enforce the HAIR COLOR provided in the input, even if it contradicts the ethnicity stereotype (e.g., Asian + Blonde).
                `;

                const result = await model.generateContent(influencerPrompt);
                let responseText = result.response.text();

                // Clean up potential markdown formatting
                responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

                try {
                    // Verify if it's valid JSON
                    JSON.parse(responseText);
                    return NextResponse.json({ prompt: responseText });
                } catch (e) {
                    console.error("Gemini generated invalid JSON for influencer", e);
                    // Fallback to manual if AI fails
                    const influencerJSON = {
                        subject: {
                            gender, age, ethnicity, hair: { color: hairColor }
                        }
                    }
                    return NextResponse.json({ prompt: JSON.stringify(influencerJSON, null, 2) });
                }
            }

            case "script": {
                const { productName, mainBenefit, tone } = data;

                if (!productName || !mainBenefit) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos do roteiro" },
                        { status: 400 }
                    );
                }

                const toneInstructions: Record<string, string> = {
                    energetic: "⚡ Vibe: Cortada, rápida, alta energia, emojis, foco em retenção.",
                    professional: "🎓 Vibe: Autoridade, séria, limpa, foco em fatos e resultados.",
                    humorous: "😂 Vibe: Irônica, leve, usa gírias de internet, meme-style.",
                    emotional: "💖 Vibe: Contação de história (storytelling), música triste/inspiradora de fundo.",
                    urgent: "🚨 Vibe: Escassez, promoção relâmpago, 'só hoje', gatilho de perda.",
                    asmr: "🌿 Vibe: Sussurrada, sons satisfatórios, calma, 'satisfying'."
                };

                const selectedTone = toneInstructions[tone || "energetic"];

                const scriptPrompt = `ACT AS A BRAZILIAN TIKTOK SCRIPTWRITER (VIRAL EXPERT).

**MANDATORY INPUTS:**
- Product: "${productName}"
- Main Benefit: "${mainBenefit}"
- Tone: ${selectedTone}

**STRICT RULES FOR VIRALITY:**
1.  **NO CORPORATE SPEAK:** Do not use words like "inovador", "solução", "qualidade". Use "brabo", "bizarro", "segredo".
2.  **HOOKS MUST BE < 3 SECONDS:** The first sentence must stop the scroll immediately.
3.  **NATIVE BRAZILIAN PORTUGUESE:** Use natural slang (gírias) appropriate for the tone.
4.  **DIRECT ADDRESS:** Use "Você" (You).

**FORMAT (JSON-LIKE STRUCTURE FOR PARSING):**

**OPTION 1: THE PATTERN INTERRUPT (Visual Hook)**
[Scene]: (Visual description of something weird/satisfying)
[Text Overlay]: (Big bold text, max 3 words)
[Audio]: "(Script in PT-BR, casual and fast)"

---

**OPTION 2: THE SECRET/HACK (Curiosity Hook)**
[Scene]: (Close up whispering or showing hidden feature)
[Text Overlay]: "Não conte pra ninguém..."
[Audio]: "(Script in PT-BR, conspiratorial tone)"

---

**OPTION 3: THE DRAMATIC PROBLEM (Relatable Hook)**
[Scene]: (Person looking frustrated)
[Text Overlay]: "Cansada de...?"
[Audio]: "(Script in PT-BR, empathetic then solution)"`;

                const result = await model.generateContent(scriptPrompt);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "fashion": {
                const { image, mediaType, influencerJSON, customScript, tone, duration } = data;

                if (!image) {
                    return NextResponse.json(
                        { error: "Faça o upload da roupa" },
                        { status: 400 }
                    );
                }

                imageParts.push(fileToGenerativePart(image, "image/jpeg"));

                const visionPrompt = `ACT AS A SENIOR FASHION STYLIST AND TECHNICAL ANALYST.
                
Analyze this outfit for a Generative AI prompt. Focus on VISUAL FIDELITY.

**MANDATORY OUTPUT FIELDS:**
1. **Garment Construction:** Exact cut, length, neckline, sleeve style, closures.
2. **Fabric Physics:** Weight (heavy/light), sheen (matte/satin), texture (ribbed/smooth).
3. **Color Accuracy:** Specific vibrant hex-code vibes (e.g. "Chartreuse" instead of "Green").
4. **Fit Dynamics:** How it sits on the body (draped, tight, structured).

Output ONLY the technical description. No intro.`;

                const visionResult = await model.generateContent([visionPrompt, ...imageParts]);
                const clothingDescription = visionResult.response.text();

                let influencerDesc = "";
                let hasInfluencer = false;
                if (influencerJSON) {
                    try {
                        const influencerData = JSON.parse(influencerJSON);
                        const subject = influencerData.subject;

                        // Extract realism details
                        const skinDetails = subject.skin_texture?.details?.join(", ") || "visible pores, vellus hair, textured skin";
                        const features = subject.features_description || "unique features";

                        // Extract structural details for variety
                        const faceStruct = subject.face ? `, ${subject.face.shape}, ${subject.face.nose}, ${subject.face.lips}` : "";

                        influencerDesc = `(${subject.gender}, ${subject.age}y, ${subject.ethnicity}, ${features}${faceStruct}. Hair: ${subject.hair.color} ${subject.hair.style}. Skin: ${skinDetails}).`;
                        hasInfluencer = true;
                    } catch (e) {
                        console.log("Invalid influencer JSON");
                    }
                }

                // Advanced Tone Mapping for Visuals
                const toneVisuals: Record<string, { lighting: string; camera: string; vibe: string; scriptStyle: string }> = {
                    energetic: {
                        lighting: "High-key, bright sunlight, vibrant saturation",
                        camera: "Dynamic movement, slight handheld shake for realism, fast cuts",
                        vibe: "Trendy, Pop, TikTok Viral",
                        scriptStyle: "Excited and fast"
                    },
                    professional: {
                        lighting: "Soft studio 3-point lighting, clean white balance",
                        camera: "Stable tripod shot, slow cinematic dolly push",
                        vibe: "Luxury, E-commerce, Clean Girl Aesthetic",
                        scriptStyle: "Educational and calm"
                    },
                    humorous: {
                        lighting: "Natural everyday lighting, slightly unpolished",
                        camera: "Front camera selfie angle (fisheye distortion effect), handheld",
                        vibe: "Relatable, Casual, Meme-ready",
                        scriptStyle: "Funny and casual"
                    },
                    emotional: {
                        lighting: "Golden hour (warm sunset), lens flares, soft contrast",
                        camera: "Slow motion (60fps), tight close-ups on details",
                        vibe: "Cinematic, Dreamy, Inspiring",
                        scriptStyle: "Soft and storytelling"
                    },
                    urgent: {
                        lighting: "Contrast heavy, neon accents, flashing effect",
                        camera: "Snap zooms, erratic movement",
                        vibe: "Sale, FOMO, Breaking News",
                        scriptStyle: "Fast and loud"
                    },
                    asmr: {
                        lighting: "Dim, cozy warm light (2700K), soft shadows",
                        camera: "Macro lens, extremely stable, very slow movement",
                        vibe: "Cozy, Sensory, Texture-focused",
                        scriptStyle: "Whispered"
                    }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Create a ${currentTone.scriptStyle} script in PT-BR about this look)`;

                if (mediaType === "photo") {
                    finalPrompt = `**PROMPT FOR FLUX/MIDJOURNEY V6 (REALISM MODE)**

**SUBJECT:**
Beautiful influencer ${influencerDesc} wearing:
${clothingDescription}

**ENVIRONMENT & LIGHTING:**
- Location: Modern luxury boutique fitting room.
- Lighting: ${currentTone.lighting}.
- Atmosphere: ${currentTone.vibe}.

**PHOTOGRAPHY SPECS:**
- Camera: Sony A7R V, 35mm f/8 GM Lens (Deep Focus).
- Quality: 8k, Raw Photo, Hyper-detailed skin texture (pores, vellus hair), Ray-traced reflections.
- Framing: Full body mirror selfie (Mirror reflection visible).
- Style: Influencer Instagram Story aesthetic.

**NEGATIVE PROMPT:**
Plastic skin, 3d render, cartoon, doll, smooth skin, airbrushed, blur, low quality.`;
                } else {
                    finalPrompt = `**VIDEO PROMPT (KLING/LUMA/RUNWAY/FLOW)**

**KEYFRAMES:**
1. Start: Influencer stands in front of mirror, phone covering face slightly.
2. Action: She lowers phone to chest level, does the "fit check" spin (30 degrees).
3. Physics: ${clothingDescription} moves naturally. Pay attention to fabric weight.

**CHARACTER:**
${hasInfluencer ? `STRICT FACE CONSISTENCY: ${influencerDesc}` : "A stylish fashion influencer."}

**CINEMATOGRAPHY:**
- Camera Movement: ${currentTone.camera}.
- Lighting: ${currentTone.lighting}.
- Color Grade: ${currentTone.vibe}.

**AUDIO SCRIPT (PT-BR):**
${audioScript}

**NEGATIVE PROMPT:**
Morphing, melting hands, text glitches, extra fingers, cartoon, drawing, painting, bad physics.`;
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            case "pov": {
                const { image: productImage, mediaType, customScript, tone, duration } = data;

                if (!productImage) {
                    return NextResponse.json(
                        { error: "Faça o upload da imagem do produto" },
                        { status: 400 }
                    );
                }

                // Add image for Gemini Vision
                imageParts.push(fileToGenerativePart(productImage, "image/jpeg"));

                // Ask Gemini to describe the product
                const productVisionPrompt = `Describe this product for a video generation prompt.
Focus on:
1. **Logo Consistency:** Exact text on labels, logo placement, specific colors.
2. **Material properties:** Glass reflection, plastic matte, paper texture.
3. **Form Factor:** Bottle shape, box dimensions, tube squeeze state.

Write a dense, comma-separated description optimized for text-to-video persistence.`;

                const productResult = await model.generateContent([productVisionPrompt, ...imageParts]);
                const productDescription = productResult.response.text();

                // Tone Mapping for POV
                const toneVisuals: Record<string, { lighting: string; movement: string; audioType: string }> = {
                    energetic: { lighting: "Daylight, bright window", movement: "Quick unboxing, fast hands", audioType: "Excited" },
                    professional: { lighting: "Studio softbox", movement: "Precise, slow handling", audioType: "Educational" },
                    humorous: { lighting: "Home living room", movement: "Casual, maybe a bit clumsy/real", audioType: "Funny" },
                    emotional: { lighting: "Warm lamp, evening", movement: "Gentle caress of packaging", audioType: "Grateful" },
                    urgent: { lighting: "Bright, high contrast", movement: "Rushed, bringing close to camera", audioType: "Urgent" },
                    asmr: { lighting: "Dark room, RGB accent", movement: "Tapping, scratching, slow rotation", audioType: "Whisper" }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Write a ${currentTone.audioType} mini-review in PT-BR)`;

                if (mediaType === "photo") {
                    finalPrompt = `**MACRO POV PHOTOGRAPHY (PRODUCT FOCUSED)**

**SUBJECT (MANDATORY):**
First-person view (POV) of a hand holding: ${productDescription}.

**STRICT FIDELITY RULES:**
- The product MUST match the description 100%. No hallucinated text.
- Label text must be legible and sharp.
- NO warping of the product geometry.

**HAND DETAILS:**
- Skin texture: Hyper-realistic, visible knuckles and veins.
- Nails: Manicured, natural look.

**SCENE:**
- Lighting: ${currentTone.lighting}.
- Background: Visible and Detailed (Wide depth of field). Use ${currentTone.lighting} to illuminate the room.
- Lens: 24mm Wide Angle f/8 (Deep focus).`;
                } else {
                    const totalDuration = parseInt(duration || "8");
                    const clips = Math.ceil(totalDuration / 8);

                    if (clips > 1) {
                        finalPrompt = `ACT AS A VIDEO DIRECTOR.
**OBJECTIVE:** Create ${clips} sequential POV prompts for a ${totalDuration}s unboxing video.

**PRODUCT:** ${productDescription}

**OUTPUT FORMAT:**
"Prompt 1 --- Prompt 2 --- Prompt 3"

**SEQUENCE:**
Clip 1 (0-8s): POV holding the product, slowly rotating it.
Clip 2 (8-16s): POV showing the texture/opening the product.
Clip 3+ (16s+): POV applying/using the product.

**MANDATORY:**
- Maintain POV consistency.
- Product details must remain constant.`;
                    } else {
                        finalPrompt = `**VIDEO PROMPT (POV UNBOXING - FLOW/KLING)**

**SCENE:**
First-person view (POV). A realistic hand holding: ${productDescription}.

**ACTION:**
${currentTone.movement}. The hand rotates the product to show the label, then tilts it to show the texture/cap.

**TECHNICAL:**
- Stabilization: Cinematic Gimbal (No shaky cam unless intended).
- Lighting: ${currentTone.lighting}.
- Focus: Rack focus on the product label.

**AUDIO (PT-BR):**
${audioScript}

**SAFETY:**
NO morphing labels. NO melting fingers. The product must remain solid rigid object.

**NEGATIVE PROMPT:**
Morphing, melting hands, text glitches, extra fingers, cartoon, drawing, painting, bad physics, low resolution, blurry.`;
                    }
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            case "showcase": {
                const { productImages, mediaType, influencerJSON, customScript, tone, duration } = data;

                // Support both old single image format and new multiple images format
                const images = productImages || (data.productImage ? [data.productImage] : []);

                if (!images || images.length === 0) {
                    return NextResponse.json(
                        { error: "Faça o upload de pelo menos uma foto do produto" },
                        { status: 400 }
                    );
                }

                // Add all product images for Gemini Vision
                images.forEach((image: string) => {
                    imageParts.push(fileToGenerativePart(image, "image/jpeg"));
                });

                const imageCount = images.length;
                const multiImageNote = imageCount > 1
                    ? `You are viewing ${imageCount} images of the SAME product from different angles/views.`
                    : "You are viewing 1 image of this product.";

                const productPrompt = `ACT AS A FORENSIC PRODUCT ANALYST.

${multiImageNote}

**CRITICAL MISSION:** ${imageCount > 1 ? 'Analyze ALL images together and create ONE comprehensive description combining all views.' : 'Describe this EXACT product with 100% VISUAL FIDELITY.'}

**MANDATORY RULES:**
1. **ZERO INTERPRETATION:** Describe ONLY what you see. Do NOT invent, assume, or create variations.
2. **EXACT TEXT TRANSCRIPTION:** Copy ALL visible text/logos EXACTLY as written (letter-by-letter).
3. **PRECISE COLOR MATCHING:** Describe exact colors you see (e.g., "Deep navy blue with gold accents").
4. **ACCURATE SHAPE/FORM:** Describe the exact shape, size proportions, and physical structure.
${imageCount > 1 ? '5. **COMBINE ALL VIEWS:** Extract information from ALL images. Note different angles (front, back, side, detail shots) if visible.' : ''}

**OUTPUT FORMAT (Comma-separated, dense description):**
"[EXACT PRODUCT TYPE], [EXACT BRAND NAME if visible], [PRECISE COLORS], [MATERIAL TYPE], [SHAPE/FORM FACTOR], [ALL VISIBLE TEXT/LABELS from any image], [DISTINCTIVE FEATURES]"

**EXAMPLE:**
"Cylindrical glass bottle, transparent with rose gold metallic cap, 'LUXE SERUM' written in serif font on white label, 30ml dropper bottle, minimalist design"

**CRITICAL:** This description will be used for AI image generation. Any deviation from the actual product will create the WRONG product. BE LITERAL.`;
                const productResult = await model.generateContent([productPrompt, ...imageParts]);
                const productDesc = productResult.response.text();

                let influencerDesc = "";
                let hasInfluencer = false;
                if (influencerJSON) {
                    try {
                        const influencerData = JSON.parse(influencerJSON);
                        const subject = influencerData.subject;

                        // Extract realism details
                        const skinDetails = subject.skin_texture?.details?.join(", ") || "visible pores, vellus hair";

                        // Structural variety
                        const faceStruct = subject.face ? `, ${subject.face.shape}, ${subject.face.nose}, ${subject.face.lips}` : "";

                        influencerDesc = `(${subject.gender}, ${subject.age}y, ${subject.ethnicity}, ${subject.features_description}${faceStruct}. Skin: ${skinDetails})`;
                        hasInfluencer = true;
                    } catch (e) {
                        console.log("Invalid JSON");
                    }
                }

                // Tone Mapping for Showcase
                const toneVisuals: Record<string, { mood: string; expression: string; audio: string }> = {
                    energetic: { mood: "Vibrant, Pop Art", expression: "Wide smile, surprised eyes (Pog face)", audio: "Shocked" },
                    professional: { mood: "Clean, Clinical, White", expression: "Confident, soft smile", audio: "Expert" },
                    humorous: { mood: "Playful, Colorful", expression: "Winking or making a funny face", audio: "Joking" },
                    emotional: { mood: "Warm, Golden, Cozy", expression: "Soft smile, looking lovingly at product", audio: "Loving" },
                    urgent: { mood: "Intense, High Contrast", expression: "Serious, pointing urgently", audio: "Warning" },
                    asmr: { mood: "Dim, Bedroom, RGB", expression: "Relaxed, closed eyes smell test", audio: "Soft" }
                };

                const currentTone = toneVisuals[tone || "energetic"];
                const audioScript = customScript ? `"${customScript}"` : `(Write a ${currentTone.audio} reaction in PT-BR)`;

                if (mediaType === "photo") {
                    const multiImageNote = imageCount > 1
                        ? `\n\n**REFERENCE IMAGES:** This description was created by analyzing ${imageCount} different views/angles of the same product.`
                        : "";

                    finalPrompt = `**BEAUTY/LIFESTYLE PORTRAIT (PRODUCT HERO)**

**SUBJECT (MANDATORY):**
${hasInfluencer ? `**INFLUENCER (STRICT):** ${influencerDesc}` : "A stunning HIGH-FASHION model"}
Holding product: ${productDesc}.${multiImageNote}

**PRODUCT FIDELITY RULES (CRITICAL):**
- The product MUST match this description EXACTLY: ${productDesc}
- ALL visible text/logos on the product must be IDENTICAL to the description
- Product colors, shape, and materials must be PRECISE
- NO creative variations or "similar" products allowed
- If brand name is mentioned, it MUST appear correctly

**POSE & COMPOSITION:**
- Product Placement: Held next to face/cheek (Beauty Youtuber Thumbnail style).
- **LABEL VISIBILITY:** 100% visible to camera, sharp text, no glare, no distortion.
- Expression: ${currentTone.expression}.

**AESTHETIC:**
- Lighting: Ring Light + Softbox (E-commerce standard).
- Mood: ${currentTone.mood}.
- Camera: Canon R5, 85mm f/1.2 Portrait Lens.
- Quality: Magazine retouching, sharp eyes, readable product label.

**NEGATIVE PROMPT:**
Wrong product, different packaging, altered text, modified colors, generic product, placeholder product, incorrect branding.`;
                } else {
                    const totalDuration = parseInt(duration || "8");
                    const clips = Math.ceil(totalDuration / 8);

                    if (clips > 1) {
                        finalPrompt = `ACT AS A VIDEO DIRECTOR.
**OBJECTIVE:** Create ${clips} sequential prompts for a ${totalDuration}s product showcase.

**CONTEXT:**
- Influencer: ${hasInfluencer ? influencerDesc : "Model"}
- Product: ${productDesc}

**CRITICAL PRODUCT FIDELITY RULES:**
- The product MUST be: ${productDesc}
- This EXACT product must appear consistently in ALL clips
- NO variations in branding, colors, or text between clips
- Product must remain visually identical throughout the entire sequence

**OUTPUT FORMAT:**
"Prompt 1 --- Prompt 2 --- Prompt 3"

**SEQUENCE:**
Clip 1 (0-8s): Influencer holding product near face, smiling.
Clip 2 (8-16s): Close up on product texture/application.
Clip 3+ (16s+): Influencer reaction/result.

**MANDATORY:**
- Influencer face consistency.
- Product label consistency (CRITICAL - must be identical in all clips).`;
                    } else {
                        finalPrompt = `**VIDEO PROMPT (PRODUCT TESTIMONIAL)**

**CHARACTER:**
${hasInfluencer ? `**INFLUENCER (STRICT):** ${influencerDesc}` : "Professional Influencer"} reviewing a product.

**PRODUCT (MANDATORY FIDELITY):**
The product being shown is: ${productDesc}
- This EXACT product must appear in every frame
- ALL text/logos must match the description precisely
- Colors, shape, and branding must be IDENTICAL
- NO substitutions or "similar" products

**ACTION KEYFRAMES:**
1. Influencer defines ${currentTone.expression}.
2. Holds ${productDesc} up to the camera lens (Macro shot).
3. Pulls back and points to the product.

**ATMOSPHERE:**
- Mood: ${currentTone.mood}.
- Background: Aesthetic bedroom or studio.

**AUDIO (PT-BR):**
${audioScript}

**TECH SPECS:**
- 4k Resolution.
- No hand clipping.
- Accurate product scale.
- Product must remain visually consistent throughout.

**NEGATIVE PROMPT:**
Wrong product, morphing packaging, changing text, color shifts, generic product, placeholder branding.`;
                    }
                }

                return NextResponse.json({ prompt: finalPrompt });
            }

            case "scenario": {
                const { environmentType, visualStyle, lighting, details } = data;

                if (!environmentType || !visualStyle || !lighting) {
                    return NextResponse.json(
                        { error: "Preencha todos os campos obrigatórios" },
                        { status: 400 }
                    );
                }

                const scenarioPrompt = `ACT AS A PROFESSIONAL ENVIRONMENT/SCENE DESIGNER.

**OBJECTIVE:** Create a highly detailed prompt for an environment ONLY.

**MANDATORY CONSTRAINTS:**
- Environment Type: ${environmentType}
- Visual Style: ${visualStyle}
- Lighting: ${lighting}
- Detail Level: Extreme (8k)

**REQUIRED ELEMENTS:**
1. **Scene Description:** Detailed view of the ${environmentType}. Be specific about architecture, furniture.
2. **Visual Style:** Apply ${visualStyle} aesthetic throughout.
3. **Lighting:** ${lighting}.
4. **Textures:** Describe materials (wood, glass, fabric) in depth.

**CRITICAL RULES:**
- NO PEOPLE.
- NO HUMAN FIGURES.
- NO BODY PARTS.
- FOCUS ON THE EMPTY SPACE.

**OUTPUT FORMAT:**
Single detailed prompt string.`;

                const result = await model.generateContent(scenarioPrompt);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "thumbnail": {
                const { expression, contentType, thumbnailText, influencerJSON, referenceImage } = data;

                if (!expression || !thumbnailText) {
                    return NextResponse.json(
                        { error: "Preencha a expressão e o texto da thumbnail" },
                        { status: 400 }
                    );
                }

                // Parse influencer data more robustly
                let influencerDesc = "Generic attractive content creator (neutral features)";
                let hasInfluencer = false;

                if (influencerJSON && influencerJSON.length > 10) {
                    try {
                        const parsed = JSON.parse(influencerJSON);
                        // Handle both full JSON structure or partial
                        const subject = parsed.subject || parsed;

                        if (subject) {
                            influencerDesc = `**INFLUENCER IDENTITY (MUST MATCH EXACTLY):**
                            - Gender: ${subject.gender || 'Not specified'}
                            - Age: ${subject.age || '25'} years old
                            - Ethnicity: ${subject.ethnicity || 'Not specified'}
                            - Hair: ${subject.hair?.color || subject.hair || 'Styled'} 
                            - Eyes: ${subject.eyes?.color || subject.eyes || 'Expressive'}
                            - Distinctive Features: ${subject.features_description || 'None'}`;
                            hasInfluencer = true;
                        }
                    } catch (e) {
                        console.log("Error parsing influencer JSON in thumbnail", e);
                    }
                }

                if (referenceImage) {
                    imageParts.push(fileToGenerativePart(referenceImage, "image/jpeg"));
                }

                // Enhanced expression details
                const expressionDetails: Record<string, string> = {
                    shocked: "EXTREME SHOCK: Mouth wide open in an 'O' shape, eyes popping out, hands on cheeks (Home Alone style).",
                    amazed: "PURE AMAZEMENT: Sparkling eyes, wide smile, eyebrows raised high, leaning forward with intense curiosity.",
                    mindblown: "MIND BLOWING: Head tilted back, mouth agape, hands exploding from head gesture, eyes extremely wide.",
                    determined: "INTENSE DETERMINATION: Furrowed brows, piercing stare directly at lens, clenched jaw, serious power pose.",
                    emotional: "DEEP EMOTION: Glossy eyes (tearing up), soft vulnerable frown, hand over heart, touching moment.",
                    smirk: "CONFIDENT SMIRK: One eyebrow raised high, half-smile, head tilted slightly down, looking through eyebrows.",
                    excited: "HYPER EXCITEMENT: Huge open-mouth smile, squinting happy eyes, dynamic energy, motion blur on hands.",
                    skeptical: "HEAVY SKEPTICISM: One eyebrow raised, lips pursed to side, judging look, chin tucked in.",
                    laughing: "UNCONTROLLABLE LAUGHTER: Head thrown back, eyes shut tight, mouth wide open, genuine joy.",
                    serious: "DEAD SERIOUS: Zero emotion, direct intense eye contact, intimidating stare, dramatic lighting."
                };

                const expressionDetail = expressionDetails[expression] || "High energy expressive face";

                const thumbnailPrompt = `
                ACT AS A WORLD-CLASS YOUTUBE THUMBNAIL DESIGNER (Top 0.1% CTR).
                
                **OBJECTIVE:** 
                Create a text-to-image prompt for a viral thumbnail. 
                You must STRICTLY follow the user's constraints below.

                **USER CONSTRAINTS (MANDATORY):**
                1. **TEXT OVERLAY:** "${thumbnailText}" (Must be legible, big, bold).
                2. **EXPRESSION:** ${expressionDetail}
                3. **SUBJECT:** ${influencerDesc}
                4. **CONTEXT:** ${contentType} style video.

                **YOUR TASK:**
                Write a highly detailed prompt for Midjourney/Flux.
                
                **STRUCTURE OF THE PROMPT TO GENERATE:**
                "[SUBJECT DESCRIPTION] doing [EXPRESSION], extreme close-up, [LIGHTING], [BACKGROUND], text '${thumbnailText}' written on [OBJECT/AIR], high contrast, 8k, hyper-realistic."

                **CRITICAL RULES:**
                - If the Subject is an Influencer, you MUST describe their physical traits (Hair, Ethnicity, Eyes) exactly as provided.
                - The Expression must be EXAGGERATED (YouTube style).
                - The Text "${thumbnailText}" is the most important element after the face.

                **OUTPUT:** 
                Provide ONLY the final prompt string. No explanations.`;

                const promptToUse = imageParts.length > 0
                    ? [thumbnailPrompt, ...imageParts]
                    : thumbnailPrompt;

                const result = await model.generateContent(promptToUse);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            case "pets": {
                const { petType, breed, action, scenario, personality, petPhoto, details } = data;

                if (!petType || !breed) {
                    return NextResponse.json(
                        { error: "Preencha o tipo de pet e a raça/descrição" },
                        { status: 400 }
                    );
                }

                // Add pet photo if provided
                if (petPhoto) {
                    imageParts.push(fileToGenerativePart(petPhoto, "image/jpeg"));
                }

                // Personality-based styling
                const personalityStyles: Record<string, { mood: string; camera: string; lighting: string }> = {
                    cute: { mood: "Heartwarming, adorable", camera: "Slightly from above (cute angle)", lighting: "Soft, flattering natural light" },
                    funny: { mood: "Comedic, meme-worthy", camera: "Unexpected angle or close-up", lighting: "Bright, clear" },
                    elegant: { mood: "Sophisticated, regal", camera: "Eye level, portrait style", lighting: "Studio lighting, dramatic" },
                    energetic: { mood: "Dynamic, action-packed", camera: "Fast shutter, motion blur acceptable", lighting: "Bright, vibrant" },
                    lazy: { mood: "Chill, relaxed vibes", camera: "Wide shot showing comfortable position", lighting: "Warm, cozy afternoon light" },
                    curious: { mood: "Inquisitive, exploratory", camera: "Close-up on eyes/face", lighting: "Natural, clear" },
                    dramatic: { mood: "Over-the-top, theatrical", camera: "Low angle for grandeur", lighting: "Cinematic, high contrast" },
                    sassy: { mood: "Attitude, sass", camera: "Side eye angle", lighting: "Bold, confident" },
                    majestic: { mood: "Epic, powerful", camera: "Low angle hero shot", lighting: "Golden hour, backlit" },
                    derpy: { mood: "Goofy, silly", camera: "Weird angle, tongue out", lighting: "Fun, unstaged" }
                };

                const currentPersonality = personalityStyles[personality] || personalityStyles.cute;

                const petsPrompt = imageParts.length > 0
                    ? `Analyze this pet photo and create a viral TikTok/Instagram prompt.

**PET IDENTITY (MANDATORY):**
- Type: ${petType}
- Breed: ${breed}
- Action: ${action}
- Scenario: ${scenario}

**REQUIREMENTS:**
1. **VISUAL FIDELITY:** Capture the pet's unique markings/colors from the photo.
2. **ACTION:** ${action} (Make it dynamic/cute).
3. **LIGHTING:** ${currentPersonality.lighting}.
4. **STYLE:** ${currentPersonality.camera}.

**OUTPUT:** Detailed prompt for generating this SPECIFIC pet in the specified action.`
                    : `ACT AS A VIRAL PET CONTENT CREATOR.

**OBJECTIVE:** Create a prompt for generating adorable, shareable pet content.

**MANDATORY SPECS:**
- Type: ${petType}
- Breed: ${breed}
- Action: ${action}
- Scenario: ${scenario}
- Vibe: ${personality}

**PROMPT STRUCTURE:**
"[BREED], [ACTION] in [SCENARIO], [CAMERA ANGLE], [LIGHTING], [MOOD], highly detailed fur/feathers, 8k, photorealistic."

**CRITICAL RULES:**
- Maximize "Cuteness Factor".
- Ensure natural anatomy (4 legs, correct ears).
- focus on eyes.

**OUTPUT:**
Single detailed prompt.`;

                const promptToUse = imageParts.length > 0
                    ? [petsPrompt, ...imageParts]
                    : petsPrompt;

                const result = await model.generateContent(promptToUse);
                const response = result.response.text();

                return NextResponse.json({ prompt: response });
            }

            default:
                return NextResponse.json(
                    { error: "Tipo de tab inválido" },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error("Erro ao gerar prompt:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao gerar prompt" },
            { status: 500 }
        );
    }
}
