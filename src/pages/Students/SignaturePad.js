import React, { useRef, useEffect, useState, useCallback } from 'react';

// Main App component for the signature pad
function SignaturePad() {
    // useRef hook to get a direct reference to the canvas DOM element
    const canvasRef = useRef(null);
    // useState hook to manage the drawing state (true when mouse is down, false otherwise)
    const [isDrawing, setIsDrawing] = useState(false);
    // useState hook to store the 2D rendering context of the canvas
    const [context, setContext] = useState(null);
    // useState hook to store the signature data as a Data URL (e.g., base64 encoded image)
    const [signatureData, setSignatureData] = useState('');

    // useCallback hook to memoize the resizeCanvas function, preventing unnecessary re-renders
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas ref is not yet available

        // Set display size using Tailwind-like classes (fixed width/height for this example)
        canvas.style.width = '400px';
        canvas.style.height = '150px';

        // Calculate ratio for high-DPI (Retina) displays to ensure crisp lines
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        // Set the actual canvas drawing surface dimensions, scaled by the device pixel ratio
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Scale the context by the ratio to account for the high-DPI scaling
            ctx.scale(ratio, ratio);
            // Set initial drawing properties
            ctx.fillStyle = '#f8f8f8'; // Background color of the signature pad
            ctx.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio); // Fill background
            ctx.strokeStyle = '#1a202c'; // Stroke color for the signature (dark text color)
            ctx.lineWidth = 2; // Thickness of the drawing line
            ctx.lineCap = 'round'; // Shape of the end of the line segment
            setContext(ctx); // Store the context in state once it's configured
        }
    }, []);

    // useEffect hook for initial canvas setup and handling window resize
    useEffect(() => {
        // Call resizeCanvas on component mount
        resizeCanvas();
        // Add event listener for window resize
        window.addEventListener('resize', resizeCanvas);

        // Cleanup function: remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [resizeCanvas]); // Dependency array: re-run effect if resizeCanvas changes

    // Event handler for mouse down on the canvas
    const startDrawing = (e) => {
        if (!context) return;
        setIsDrawing(true); // Set drawing state to true
        context.beginPath(); // Start a new path for drawing
        // Move the drawing pen to the current mouse position (adjusted for canvas offsets)
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    // Event handler for mouse move on the canvas
    const draw = (e) => {
        if (!isDrawing || !context) return;
        // Draw a line from the current point to the new mouse position
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke(); // Render the line
    };

    // Event handler for mouse up or mouse leave on the canvas
    const stopDrawing = () => {
        if (!context) return;
        setIsDrawing(false); // Set drawing state to false
        // Get the signature as a data URL and store it in state
        setSignatureData(canvasRef.current.toDataURL());
    };

    // Event handler to clear the signature pad
    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!context || !canvas) return;

        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw the background color
        context.fillStyle = '#f8f8f8';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Clear the stored signature data
        setSignatureData('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6 bg-white rounded-xl shadow-lg">
                {/* Label for the signature pad */}


                {/* Signature Canvas */}
                <canvas
                    id="signaturePad"
                    ref={canvasRef} // Assign the ref to the canvas element
                    // Apply Tailwind CSS classes for styling the signature pad
                    className="signature-pad border border-gray-300 rounded-lg bg-gray-50 cursor-crosshair w-[400px] h-[150px]"
                    // Event listeners for drawing functionality
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing} // Also stop drawing if mouse leaves the canvas area
                ></canvas>

                {/* Signature Pad Controls */}
                <div style={{marginTop: 20}} className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mt-4 md:mt-0">
                    <button
                        type="button"
                        onClick={clearSignature} // Attach clearSignature function to button click
                        className="bg-gray-700 text-white py-2 px-4 rounded-md cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        style={{
                            backgroundColor: "#4a5568",
                            color: "white",
                            padding: "8px 15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "0.9em",
                            transition: "background-color 0.2s"
                        }}
                    >
                        Clear Signature
                    </button>
                </div>
            </div>

            {/* Hidden input to store signature data (for form submission, if needed) */}
            <input type="hidden" id="signatureData" name="signatureData" value={signatureData} />

            {/* Optionally display the signature data URL for debugging/verification */}

        </div>
    );
}

export default SignaturePad;
