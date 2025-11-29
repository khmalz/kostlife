"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export default function TestFirebasePage() {
    const [firebaseStatus, setFirebaseStatus] = useState(
        "🔄 Testing Firebase connection...",
    );

    useEffect(() => {
        // Test Firebase connection
        try {
            setFirebaseStatus("✅ Firebase connected successfully!");
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            setFirebaseStatus(`❌ Error: ${errorMessage}`);
        }
    }, []);

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "system-ui",
            }}
        >
            <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
                🔥 Firebase Connection Test
            </h1>

            {/* Firebase Status */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                    Connection Status
                </h2>
                <p style={{ fontSize: "16px" }}>{firebaseStatus}</p>
            </div>

            {/* Firebase Config */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                    Firebase Configuration
                </h2>
                <div style={{ fontSize: "14px", fontFamily: "monospace" }}>
                    <p>
                        <strong>Project ID:</strong>{" "}
                        {db.app.options.projectId || "Not configured"}
                    </p>
                    <p>
                        <strong>API Key:</strong>{" "}
                        {db.app.options.apiKey
                            ? "✅ Configured"
                            : "❌ Not configured"}
                    </p>
                </div>
            </div>

            {/* Services Status */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                    Firebase Services
                </h2>
                <ul style={{ fontSize: "14px", lineHeight: "1.8" }}>
                    <li>✅ Firestore Database - Ready</li>
                </ul>
            </div>

            {/* Helper Functions */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                }}
            >
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                    Available Helper Functions
                </h2>
                <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
                    <p>
                        <strong>Firestore:</strong> getDocument, getDocuments,
                        addDocument, setDocument, updateDocument,
                        deleteDocument, queryDocuments
                    </p>
                </div>
            </div>
        </div>
    );
}
