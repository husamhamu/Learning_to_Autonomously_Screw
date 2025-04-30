import {Button, Card, Flex, Tooltip, Image, Empty, Typography } from "antd";
import {CameraOutlined, VideoCameraAddOutlined, StopOutlined, MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {EnvironmentViewer} from "./EnvironmentViewer";
import React, {useEffect, useState, useRef } from "react";

export const CalibrationVideoStream = ({socketInstance}) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [videoFrameUrl, setVideoFrameUrl] = useState(null);

    // Function to handle image capture
    const captureImage = () => {
        console.log("Capturing frame for calibration...");

        socketInstance.emit('CaptureFrameForCalibration');
    };

    const startStreaming = () => {
        if (socketInstance) {
            console.log("Starting streaming...");

            socketInstance.emit('CaptureVideo');
            setIsStreaming(true);
        }
    };

    const stopStreaming = () => {
        if (socketInstance) {
            console.log("Stopping streaming.");

            socketInstance.emit('StopCaptureVideo');
            setIsStreaming(false);
        }
    };

    useEffect(() => {
        if (socketInstance && isStreaming) {

            // Handle incoming video stream data
            socketInstance.on('videoStream', (imageData) => {
                console.log("Frame received");
                const {image} = imageData;
                const imgBlob = new Blob([new Uint8Array(atob(image).split("").map(char => char.charCodeAt(0)))],
                                                { type: 'image/jpeg' });
                const imgUrl = URL.createObjectURL(imgBlob);
                setVideoFrameUrl(imgUrl);
            });

            // Cleanup on component unmount
            return () => {
                socketInstance.off('videoStream');
            };
        }
    }, [socketInstance, isStreaming]);

    return (
        <Card
            style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            {isStreaming ? (
                <>
                    <div>
                        <img
                            alt="Video Frame"
                            src={videoFrameUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '6px'
                            }}
                        />
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Tooltip title="Stop Streaming">
                            <Button
                                shape="circle"
                                icon={<StopOutlined/>}
                                onClick={stopStreaming}
                            />
                        </Tooltip>
                        <Tooltip title="Capture Image and Pose">
                            <Button
                                shape="circle"
                                icon={<CameraOutlined/>}
                                onClick={captureImage}
                            />
                        </Tooltip>
                    </div>
                </>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text style={{color: '#888'}}>
                            Please start streaming by clicking <VideoCameraAddOutlined style={{fontSize: '1em'}}/> and
                            then <CameraOutlined style={{fontSize: '1em'}}/> for capturing images.
                        </Typography.Text>
                    }
                >
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Tooltip title="Start Streaming">
                            <Button
                                shape="circle"
                                icon={<VideoCameraAddOutlined />}
                                onClick={startStreaming}
                            />
                        </Tooltip>
                    </div>
                </Empty>
            )
            }
        </Card>
    );
}

export const CalibrationImages = ({socketInstance}) => {
    const [isImagePopulated, setIsImagePopulated] = useState(false);
    const [capturedFrameForCalibrationUrls, setCapturedFrameForCalibrationUrls] = useState([]);

    const handleCapturedFrameForCalibrationUrls = (newImageURL) => {
        setCapturedFrameForCalibrationUrls(prevData => {
            const newData = [newImageURL, ...prevData];
            return newData;
        });
    }

    useEffect(() => {
        if (socketInstance) {

            socketInstance.on('CapturedFrameForCalibration', (imageData) => {
                console.log("Captured frame for calibration received");
                const {image} = imageData;
                const imgBlob = new Blob([new Uint8Array(atob(image).split("").map(char => char.charCodeAt(0)))],
                    { type: 'image/jpeg' });
                const imgUrl = URL.createObjectURL(imgBlob);
                handleCapturedFrameForCalibrationUrls(imgUrl);
                setIsImagePopulated(true);
            });

            // Cleanup on component unmount
            return () => {
                socketInstance.off('CapturedFrameForCalibration');
            };
        }
    }, [socketInstance]);

    return (
        <Card
            style={{
                height: '100%',
                width: '100%',
                display: 'flex', // Ensuring the Card is a flex container
                flexDirection: 'column',
                justifyContent: isImagePopulated ? '' : 'center',
                alignItems: isImagePopulated ? '' : 'center',
                overflow: 'auto',
            }}
        >
            {isImagePopulated ? (
                <>
                    <Typography.Text style={{ marginBottom: '1em', fontWeight: 'bold' }}>
                        Captured Images: {capturedFrameForCalibrationUrls.length} / 8 (8 is the recommended number of images for calibration)
                    </Typography.Text>
                    {capturedFrameForCalibrationUrls.map((imageUrl, index) => (
                        <div key={index}>
                            <img
                                alt="Calibration Images"
                                src={imageUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '6px'
                                }}
                            />
                        </div>
                    ))}
                </>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text style={{ color: '#888' }}>
                            Please start streaming by clicking <VideoCameraAddOutlined style={{ fontSize: '1em' }} /> and
                            then <CameraOutlined style={{ fontSize: '1em' }} /> for capturing images.
                        </Typography.Text>
                    }
                >
                </Empty>
            ) }

        </Card>)
}


export const CameraCalibrationResults = ({socketInstance}) => { 
       const [cameraCalibrationResults, setCameraCalibrationResults] = useState([
       {"type": "error", "message": "This is an error."} , 
       {"type": "info", "message": "This is an info."} , 
    ]);

    const getColorByType = (type) => {
        switch (type) {
            case 'error':
                return 'red';
            case 'warning':
                return 'orange'; // Or any other color you prefer for warnings
            case 'info':
                return 'white';
            case 'success':
                return 'green';
            default:
                return 'white';
        }
    };

    const cameraCalibrationResultContainerRef = useRef(null);
    const maxCameraCalibrationResults = 250; // Set the maximum number of logs to retain

    useEffect(() => {
        if (!socketInstance) {
          console.error('socketInstance is not defined');
          return;
        }     
        socketInstance.on('CameraCalibrationResults', handleCameraCalibrationResults);

        return () => {
            socketInstance.off('CameraCalibrationResults', handleCameraCalibrationResults);
        };
      }, [socketInstance]);

    useEffect(() => {
        if (cameraCalibrationResultContainerRef.current) {
            cameraCalibrationResultContainerRef.current.scrollTop = cameraCalibrationResultContainerRef.current.scrollHeight;
        }
      }, [cameraCalibrationResults]);

    const handleCameraCalibrationResults = (cameraCalibrationResults) => {
        setCameraCalibrationResults((prevCameraCalibrationResults) => {
            const newCameraCalibrationResults = [...prevCameraCalibrationResults, cameraCalibrationResults];
            // Check if the length of newLogs exceeds the MAX_LOGS limit
            if (newCameraCalibrationResults.length > maxCameraCalibrationResults) {
              return newCameraCalibrationResults.slice(newCameraCalibrationResults.length - maxCameraCalibrationResults);
            }
            return newCameraCalibrationResults;
        });    
    }

    return (
        <Card 
            style={{ 
                // backgroundColor: '#141414', 
                padding: '20px', 
                height: '100%', 
                width: '100%',
                overflow: 'auto',
            }}
        >
            {cameraCalibrationResults.map((cameraCalibrationResult, index) => (
                <div 
                    key={index} 
                    style={{ 
                        color: getColorByType(cameraCalibrationResult.type),
                    }}                >
                {cameraCalibrationResult.message}
            </div>
            ))}
      </Card>
    )}

export const CameraCalibrationViewer = ({
    socketInstance,
    robots,
    robotDatabase,
    handleAddRobot,
    hardware,
    hardwareDatabase,
    sceneTreeData,
    handleSceneTreeData,
    resetSceneTreeData,
    selectedObject,
    handleSelectedObject,
    saveSceneRef,
    importSceneRef,
    importRobotRef,
    addAssemblyRef,
    environmentRef,
    environmentTreeData,
    handleEnvironmentTreeData,
    handleSelectedItem,
    selectedItem,
    transformArrayEnvironment,
    setTransformArrayEnvironment,
    environmentViewerCameraPosition,
    handleEnvironmentViewerCameraPosition,
    transformArrayRobot,
    setTransformArrayRobot,
    pivotControlRef,
    refsEnvironment,
    addFrameToEnvironmentTreeData,
    environmentID,          
    mapFramesID,
    setMapFramesID,
    handleMapFramesID,
    mapFramesIDRef
}) => {
    const [increaseIntervalTranslationX, setIncreaseIntervalTranslationX] = useState(null);
    const [decreaseIntervalTranslationX, setDecreaseIntervalTranslationX] = useState(null);
    const [increaseIntervalTranslationY, setIncreaseIntervalTranslationY] = useState(null);
    const [decreaseIntervalTranslationY, setDecreaseIntervalTranslationY] = useState(null);
    const [increaseIntervalTranslationZ, setIncreaseIntervalTranslationZ] = useState(null);
    const [decreaseIntervalTranslationZ, setDecreaseIntervalTranslationZ] = useState(null);
    const [increaseIntervalRotationX, setIncreaseIntervalRotationX] = useState(null);
    const [decreaseIntervalRotationX, setDecreaseIntervalRotationX] = useState(null);
    const [increaseIntervalRotationY, setIncreaseIntervalRotationY] = useState(null);
    const [decreaseIntervalRotationY, setDecreaseIntervalRotationY] = useState(null);
    const [increaseIntervalRotationZ, setIncreaseIntervalRotationZ] = useState(null);
    const [decreaseIntervalRotationZ, setDecreaseIntervalRotationZ] = useState(null);

    // Repeated invocation every 200ms
    const invocation_interval = 200;

    const startContinuousIncreaseTranslationX = () => {
        increaseTranslationX(); // Immediate invocation on press
        const intervalId = setInterval(increaseTranslationX, invocation_interval);
        setIncreaseIntervalTranslationX(intervalId);
    };

    const startContinuousDecreaseTranslationX = () => {
        decreaseTranslationX(); // Immediate invocation on press
        const intervalId = setInterval(decreaseTranslationX, invocation_interval);
        setDecreaseIntervalTranslationX(intervalId);
    };

    const startContinuousIncreaseTranslationY = () => {
        increaseTranslationY(); // Immediate invocation on press
        const intervalId = setInterval(increaseTranslationY, invocation_interval);
        setIncreaseIntervalTranslationY(intervalId);
    };

    const startContinuousDecreaseTranslationY = () => {
        decreaseTranslationY(); // Immediate invocation on press
        const intervalId = setInterval(decreaseTranslationY, invocation_interval);
        setDecreaseIntervalTranslationY(intervalId);
    };

    const startContinuousIncreaseTranslationZ = () => {
        increaseTranslationZ(); // Immediate invocation on press
        const intervalId = setInterval(increaseTranslationZ, invocation_interval);
        setIncreaseIntervalTranslationZ(intervalId);
    };

    const startContinuousDecreaseTranslationZ = () => {
        decreaseTranslationZ(); // Immediate invocation on press
        const intervalId = setInterval(decreaseTranslationZ, invocation_interval);
        setDecreaseIntervalTranslationZ(intervalId);
    };

    const startContinuousIncreaseRotationX = () => {
        increaseRotationX(); // Immediate invocation on press
        const intervalId = setInterval(increaseRotationX, invocation_interval);
        setIncreaseIntervalRotationX(intervalId);
    };

    const startContinuousDecreaseRotationX = () => {
        decreaseRotationX(); // Immediate invocation on press
        const intervalId = setInterval(decreaseRotationX, invocation_interval);
        setDecreaseIntervalRotationX(intervalId);
    };

    const startContinuousIncreaseRotationY = () => {
        increaseRotationY(); // Immediate invocation on press
        const intervalId = setInterval(increaseRotationY, invocation_interval);
        setIncreaseIntervalRotationY(intervalId);
    };

    const startContinuousDecreaseRotationY = () => {
        decreaseRotationY(); // Immediate invocation on press
        const intervalId = setInterval(decreaseRotationY, invocation_interval);
        setDecreaseIntervalRotationY(intervalId);
    };

    const startContinuousIncreaseRotationZ = () => {
        increaseRotationZ(); // Immediate invocation on press
        const intervalId = setInterval(increaseRotationZ, invocation_interval);
        setIncreaseIntervalRotationZ(intervalId);
    };

    const startContinuousDecreaseRotationZ = () => {
        decreaseRotationZ(); // Immediate invocation on press
        const intervalId = setInterval(decreaseRotationZ, invocation_interval);
        setDecreaseIntervalRotationZ(intervalId);
    };

    const stopContinuousIncreaseTranslationX = () => {
        clearInterval(increaseIntervalTranslationX);
        setIncreaseIntervalTranslationX(null);
    };

    const stopContinuousDecreaseTranslationX = () => {
        clearInterval(decreaseIntervalTranslationX);
        setDecreaseIntervalTranslationX(null);
    };

    const stopContinuousIncreaseTranslationY = () => {
        clearInterval(increaseIntervalTranslationY);
        setIncreaseIntervalTranslationY(null);
    };

    const stopContinuousDecreaseTranslationY = () => {
        clearInterval(decreaseIntervalTranslationY);
        setDecreaseIntervalTranslationY(null);
    };

    const stopContinuousIncreaseTranslationZ = () => {
        clearInterval(increaseIntervalTranslationZ);
        setIncreaseIntervalTranslationZ(null);
    };

    const stopContinuousDecreaseTranslationZ = () => {
        clearInterval(decreaseIntervalTranslationZ);
        setDecreaseIntervalTranslationZ(null);
    };

    const stopContinuousIncreaseRotationX = () => {
        clearInterval(increaseIntervalRotationX);
        setIncreaseIntervalRotationX(null);
    };

    const stopContinuousDecreaseRotationX = () => {
        clearInterval(decreaseIntervalRotationX);
        setDecreaseIntervalRotationX(null);
    };

    const stopContinuousIncreaseRotationY = () => {
        clearInterval(increaseIntervalRotationY);
        setIncreaseIntervalRotationY(null);
    };

    const stopContinuousDecreaseRotationY = () => {
        clearInterval(decreaseIntervalRotationY);
        setDecreaseIntervalRotationY(null);
    };

    const stopContinuousIncreaseRotationZ = () => {
        clearInterval(increaseIntervalRotationZ);
        setIncreaseIntervalRotationZ(null);
    };

    const stopContinuousDecreaseRotationZ = () => {
        clearInterval(decreaseIntervalRotationZ);
        setDecreaseIntervalRotationZ(null);
    };

    const increaseTranslationX = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': true, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseTranslationX = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': true,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const increaseTranslationY = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': true, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseTranslationY = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': true,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const increaseTranslationZ = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': true, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseTranslationZ = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': true,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const increaseRotationX = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': true, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseRotationX = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': true,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const increaseRotationY = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': true, '-RY': false,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseRotationY = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': true,
                '+RZ': false, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const increaseRotationZ = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': true, '-RZ': false};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    const decreaseRotationZ = () => {
        if (socketInstance) {
            const robotPose = {
                '+X': false, '-X': false,
                '+Y': false, '-Y': false,
                '+Z': false, '-Z': false,
                '+RX': false, '-RX': false,
                '+RY': false, '-RY': false,
                '+RZ': false, '-RZ': true};
            socketInstance.emit('CartesianJogging', robotPose);
        }
    };

    return (<div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr', // Two columns: 1/2 for the left side, 1/2 for the right side
                gridTemplateRows: '1fr 1fr 1fr 1fr', // Two rows with equal height
                width: '100%',
                height: '100%', // Full viewport height
                gap: '2px', // Gap between the grid items
                overflow: 'hidden' // Ensures no overflow from the parent container
            }}
        >
            <div style={{gridColumn: '1 / 2', gridRow: '1 / 3', overflow: 'auto'}}>
                <CalibrationVideoStream socketInstance={socketInstance}/>
            </div>
            <div style={{gridColumn: '1 / 2', gridRow: '3 / 5', position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', top: '12px', left: '12px', zIndex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease X-Translation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseTranslationX}
                                onMouseUp={stopContinuousDecreaseTranslationX}
                                onMouseLeave={stopContinuousDecreaseTranslationX}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>X</span>
                        <Tooltip title="Increase X-Translation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseTranslationX}
                                onMouseUp={stopContinuousIncreaseTranslationX}
                                onMouseLeave={stopContinuousIncreaseTranslationX}
                            />
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease Y-Translation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseTranslationY}
                                onMouseUp={stopContinuousDecreaseTranslationY}
                                onMouseLeave={stopContinuousDecreaseTranslationY}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>Y</span>
                        <Tooltip title="Increase Y-Translation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseTranslationY}
                                onMouseUp={stopContinuousIncreaseTranslationY}
                                onMouseLeave={stopContinuousIncreaseTranslationY}
                            />
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease Z-Translation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseTranslationZ}
                                onMouseUp={stopContinuousDecreaseTranslationZ}
                                onMouseLeave={stopContinuousDecreaseTranslationZ}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>Z</span>
                        <Tooltip title="Increase Z-Translation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseTranslationZ}
                                onMouseUp={stopContinuousIncreaseTranslationZ}
                                onMouseLeave={stopContinuousIncreaseTranslationZ}
                            />
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease X-Rotation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseRotationX}
                                onMouseUp={stopContinuousDecreaseRotationX}
                                onMouseLeave={stopContinuousDecreaseRotationX}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>RX</span>
                        <Tooltip title="Increase X-Rotation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseRotationX}
                                onMouseUp={stopContinuousIncreaseRotationX}
                                onMouseLeave={stopContinuousIncreaseRotationX}
                            />
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease Y-Rotation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseRotationY}
                                onMouseUp={stopContinuousDecreaseRotationY}
                                onMouseLeave={stopContinuousDecreaseRotationY}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>RY</span>
                        <Tooltip title="Increase Y-Rotation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseRotationY}
                                onMouseUp={stopContinuousIncreaseRotationY}
                                onMouseLeave={stopContinuousIncreaseRotationY}
                            />
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                        <Tooltip title="Decrease Z-Rotation">
                            <MinusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    marginRight: '8px'
                                }}
                                onMouseDown={startContinuousDecreaseRotationZ}
                                onMouseUp={stopContinuousDecreaseRotationZ}
                                onMouseLeave={stopContinuousDecreaseRotationZ}
                            />
                        </Tooltip>
                        <span style={{fontSize: '16px', color: '#bfbfbf', marginRight: '8px'}}>RZ</span>
                        <Tooltip title="Increase Z-Rotation">
                            <PlusCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#bfbfbf',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                }}
                                onMouseDown={startContinuousIncreaseRotationZ}
                                onMouseUp={stopContinuousIncreaseRotationZ}
                                onMouseLeave={stopContinuousIncreaseRotationZ}
                            />
                        </Tooltip>
                    </div>
                </div>

                <EnvironmentViewer
                    socketInstance={socketInstance}
                    robots={robots}
                    handleAddRobot={handleAddRobot}
                    robotDatabase={robotDatabase}
                    hardware={hardware}
                    hardwareDatabase={hardwareDatabase}
                    sceneTreeData={sceneTreeData}
                    handleSceneTreeData={handleSceneTreeData}
                    resetSceneTreeData={resetSceneTreeData}
                    selectedObject={selectedObject}
                    handleSelectedObject={handleSelectedObject}
                    saveSceneRef={saveSceneRef}
                    importSceneRef={importSceneRef}
                    importRobotRef={importRobotRef}
                    addAssemblyRef={addAssemblyRef}
                    environmentRef={environmentRef}
                    environmentTreeData={environmentTreeData}
                    handleEnvironmentTreeData={handleEnvironmentTreeData}
                    handleSelectedItem={handleSelectedItem}
                    selectedItem={selectedItem}
                    transformArrayEnvironment={transformArrayEnvironment}
                    setTransformArrayEnvironment={setTransformArrayEnvironment}
                    environmentViewerCameraPosition={environmentViewerCameraPosition}
                    handleEnvironmentViewerCameraPosition={handleEnvironmentViewerCameraPosition}
                    transformArrayRobot={transformArrayRobot}
                    setTransformArrayRobot={setTransformArrayRobot}
                    pivotControlRef={pivotControlRef}
                    refsEnvironment={refsEnvironment}
                    addFrameToEnvironmentTreeData={addFrameToEnvironmentTreeData}
                    environmentID={environmentID}
                    mapFramesID={mapFramesID}
                    setMapFramesID={setMapFramesID}
                    handleMapFramesID={handleMapFramesID}
                    mapFramesIDRef={mapFramesIDRef}
                />
            </div>
            <div style={{gridColumn: '2 / 3', gridRow: '1 / 4', overflow: 'auto'}}>
                <CalibrationImages socketInstance={socketInstance}/>
            </div>
            <div style={{gridColumn: '2 / 3', gridRow: '4 / 5', overflow: 'auto'}}>
                <CameraCalibrationResults socketInstance={socketInstance}/>
            </div>
        </div>
    )
}