// src/components/PluginRenderer.js
import React from 'react';
import dynamic from 'next/dynamic';

const PluginRenderer = ({ content }) => {
    console.log("PluginRenderer (Server-Side) received content:", content); // Log received content

    if (!content) {
        return <>{content}</>; // Or handle empty content as needed
    }

    // Split content by plugin placeholders and regular content
    const contentParts = content.split(/(\[plugin:.*?\])/g);
    console.log("PluginRenderer (Server-Side) contentParts after split:", contentParts); // Log contentParts

    return (
        <div className="plugin-renderer-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '1rem' }}>
            {contentParts.map((part, index) => {
                console.log("PluginRenderer (Server-Side) Processing part:", part);

                if (part.startsWith('[plugin:')) {
                    console.log("PluginRenderer (Server-Side) Detected plugin placeholder:", part);
                    const pluginMatch = part.match(/\[plugin:(\w+)\s+data='(.*?)'\]/);
                    console.log("PluginRenderer (Server-Side) pluginMatch result:", pluginMatch);

                    if (pluginMatch) {
                        const pluginType = pluginMatch[1];
                        const pluginDataString = pluginMatch[2];
                        console.log("pluginMatch: ", pluginMatch);
                        let pluginData = {};

                        console.log("PluginRenderer (Server-Side) Extracted pluginType:", pluginType);
                        console.log("PluginRenderer (Server-Side) Extracted pluginDataString:", pluginDataString);

                        try {
                            pluginData = JSON.parse(pluginDataString || '{}');
                            console.log("PluginRenderer (Server-Side) Parsed pluginData:", pluginData);
                        } catch (jsonError) {
                            console.error("PluginRenderer (Server-Side) JSON.parse Error:", jsonError);
                            return (
                                <div key={index} className="plugin-error" style={{
                                    padding: '1rem',
                                    margin: '1rem 0',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#FEE2E2',
                                    color: '#DC2626',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    Error parsing plugin data (JSON): {jsonError.message}
                                </div>
                            );
                        }

                        const PluginComponent = dynamic(() =>
                            import(`../components/plugins/${pluginType}/index.js`)
                        );

                        if (PluginComponent) {
                            return (
                                <div key={index} className="plugin-component-wrapper" style={{
                                    margin: '1.5rem 0',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    overflow: 'hidden'
                                }}>
                                    <PluginComponent {...pluginData} />
                                </div>
                            );
                        } else {
                            console.error(`Plugin component not found for type: ${pluginType}`);
                            return (
                                <div key={index} className="plugin-error" style={{
                                    padding: '1rem',
                                    margin: '1rem 0',
                                    borderRadius: '0.5rem',
                                    color: '#DC2626',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    Plugin block type &quot;{pluginType}&quot; not found.
                                </div>
                            );
                        }
                    } else {
                        console.error("PluginRenderer (Server-Side) Invalid placeholder format:", part);
                        return (
                            <div key={index} className="plugin-error" style={{
                                padding: '1rem',
                                margin: '1rem 0',
                                borderRadius: '0.5rem',
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                Invalid plugin placeholder format: {part}
                            </div>
                        );
                    }
                } else {
                    return (
                        <div key={index} 
                            className="content-block"
                            style={{
                                margin: '1rem 0',
                                lineHeight: '1.6',
                                color: '#374151'
                            }}
                            dangerouslySetInnerHTML={{ __html: part }} 
                        />
                    );
                }
            })}
        </div>
    );
};

export default PluginRenderer;