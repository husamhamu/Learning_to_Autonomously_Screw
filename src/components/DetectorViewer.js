import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Flex, Tooltip, Image, Empty, Typography, Result, Modal, Form, Radio, Input, InputNumber, Slider, Skeleton} from "antd";
import Cropper from "react-cropper";
import {CameraOutlined, StopOutlined, SmileOutlined , ScissorOutlined, UploadOutlined, DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import { Canvas, useThree, useFrame} from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, PerspectiveCamera} from '@react-three/drei';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import {GridHelper} from 'three';
import LZString from 'lz-string'
import * as THREE from 'three';
import {ImageFromURL} from "./SimulatorComponents";
import Column from "antd/es/table/Column";

export const DeepLearningDetectorViewer = ({
    socketInstance, handleSyntheticInputImageUrl}) => {

    const [syntheticImageUrl, setSyntheticImageUrl] = useState(null); 
    const fileInputRef = React.createRef();



    const handleDeleteImageClick = () => {
        setSyntheticImageUrl(null);
        //handleSyntheticInputImageUrl(null);
    };


    const handleSyntheticImageUrl = (data) => {
        const imageBlob = URL.createObjectURL(new Blob([data.image]));
        setSyntheticImageUrl(imageBlob);
    }

    useEffect(() => {
        console.log('Socket Instance received data.');
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }
        // Event listener
        socketInstance.on('SyntheticdataImage', handleSyntheticImageUrl)
       
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('SyntheticdataImage', handleSyntheticImageUrl);

        };

    }, [socketInstance]);


    return (
       <Card
        size="small"
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                 {syntheticImageUrl ? (
                        <Card 
                        style={{
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            overflow: 'auto'}}>
                            <ImageFromURL imageUrl = {syntheticImageUrl}/>
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'}}>
                                    <Tooltip title="Delete image">
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined/>}
                                            onClick={handleDeleteImageClick}/>
                                    </Tooltip>
                                </div>        
                            </Card>
                        ) : (
                            <Card style={{
                                position: 'relative',
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '6px',
                                overflow: 'auto'}}>    
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                                <Typography.Text style={{color: '#888'}}>
                                                    Please  preview the Blender Scene with the preview Button.
                                                </Typography.Text>}
                                
                                >
                                </Empty>
                                </Card>
        )}   
       </Card>
    )
}

export const CircleDetectorViewer = ({socketInstance, handleDetectorInputImagesUrls}) => {
    const [detectorOutputImagesUrls, setDetectorOutputImagesUrls] = useState([]);
    const [isCropping, setIsCropping] = useState(false);
    const cropperRef = useRef(null);
    const [isCameraCaptureModalOpen, setIsCameraCaptureModalOpen] = useState(false);

    const handleIsCameraCaptureModalOpen = (cameraCaptureModalOpenFlag) => {
        setIsCameraCaptureModalOpen(cameraCaptureModalOpenFlag);
    }

    const handleDetectorOutputImagesUrls = (outputImagesUrls, shouldReplace = false) => {
        if (outputImagesUrls === null) {
            setDetectorOutputImagesUrls([]);
        } else if (shouldReplace) {
            setDetectorOutputImagesUrls(outputImagesUrls);
        } else {
            setDetectorOutputImagesUrls(prevImages => [...prevImages, ...outputImagesUrls]);
        }
    };

    useEffect(() => {
        console.log('Detector Output Images Urls:', detectorOutputImagesUrls);
    }, [detectorOutputImagesUrls]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Print out the file names for diagnosis
        files.forEach(file => {
            console.log('File selected:', file.name);
        });

        const imagesUrls = files.map(file => URL.createObjectURL(file));
        handleDetectorOutputImagesUrls(imagesUrls, false);
        handleDetectorInputImagesUrls(imagesUrls, false);
        console.log("Uploaded images");
        setIsCropping(false);
    };

    const handleUploadImageClick = () => {
        // Click the hidden file input element
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCaptureImageClick = () => {
        console.log("CameraCaptureModal shows up");
        handleIsCameraCaptureModalOpen(true);
    }

    const handleDeleteImageClick = (index) => {
        // Remove multiple output images (either the input or processed images)
        const updatedImages = detectorOutputImagesUrls.filter((_, i) => i !== index);
        handleDetectorOutputImagesUrls(updatedImages, true);
        // Remove multiple output images (only the input images)
        handleDetectorInputImagesUrls(updatedImages, true);
    }

    const handleDeleteAllImagesClick = () => {
        // Remove multiple output images (either the input or processed images)
        handleDetectorOutputImagesUrls(null);
        // Remove multiple output images (only the input images)
        handleDetectorInputImagesUrls(null);
    }

    const fileInputRef = React.createRef();

    const handleCapturedImageUrl = (capturedImageData) => {
        console.log("Received captured image data in DetectorViewer: ", capturedImageData);
        const imageUrl = URL.createObjectURL(new Blob([capturedImageData.image]));
        handleDetectorOutputImagesUrls([imageUrl], true);
        handleDetectorInputImagesUrls([imageUrl], true);
    }

    const handleDetectorOutputImageUrl = (imageData) => {
        console.log("Received image data in DetectorViewer: ", imageData);

        if (imageData && Array.isArray(imageData.images)) {
            console.log("Number of images received: ", imageData.images.length);

            const newImages = imageData.images.map((singleImageData) =>
                URL.createObjectURL(new Blob([singleImageData]))
            );
            handleDetectorOutputImagesUrls(newImages, true);
        } else if (imageData && imageData.image) {
            console.log("Received a single image.");
            const imageBlob = URL.createObjectURL(new Blob([imageData.image]));
            handleDetectorOutputImagesUrls([imageBlob], true);
        } else {
            console.log("Unexpected format of imageData or no images received.");
        }
    };

    const handleCropButtonClick = () => {
        setIsCropping(true);
        console.log("crop button clicked");
    }

    const handleCropImage = () => {
        if (cropperRef.current) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            if (croppedCanvas) {
                const croppedImage = croppedCanvas.toDataURL();
                handleDetectorOutputImagesUrls([croppedImage], true);
                handleDetectorInputImagesUrls([croppedImage], true);
                setIsCropping(false);
            }
        }
    };

    useEffect(() => {
        console.log('Socket Instance received data.');
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }

        // Event listener
        socketInstance.on('DetectorImage', handleDetectorOutputImageUrl);
        socketInstance.on('CapturedImage', handleCapturedImageUrl);
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('DetectorImage', handleDetectorOutputImageUrl);
            socketInstance.off('CapturedImage', handleCapturedImageUrl);
        };

    }, [socketInstance]);

    return (
        <Card
            size="small"
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {isCropping ? (
                <div>
                    <Cropper
                        src={detectorOutputImagesUrls[0]}
                        style={{ height: '100%', width: '100%', objectFit: 'contain', borderRadius: '6px' }}
                        initialAspectRatio={1}
                        guides={true}
                        ref={cropperRef}
                    />
                    <Button onClick={handleCropImage}>Crop Image</Button>
                </div>
            ):(
                <>
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex', // Ensuring the Card is a flex container
                            flexDirection: 'column',
                            overflow: 'auto',
                            // gap: '10px',
                        }}
                    >
                        {detectorOutputImagesUrls.map((imageUrl, index) => (
                            <div key={index} style={{position: 'relative'}}>
                                <img
                                    alt="detector"
                                    src={imageUrl}
                                    style={{ width: '100%', 
                                            height: '100%', 
                                            objectFit: 'contain', 
                                            borderRadius: '6px' 
                                        }}
                                />
                                <Button
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        zIndex: 1
                                    }}
                                    shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => handleDeleteImageClick(index)}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Tooltip title="Upload Image">
                            <Button
                                shape="circle"
                                icon={<UploadOutlined/>}
                                onClick={handleUploadImageClick}
                            />
                        </Tooltip>
                        <Tooltip title="Capture Image">
                            <Button
                                shape="circle"
                                icon={<CameraOutlined/>}
                                onClick={handleCaptureImageClick}
                            />
                        </Tooltip>
                        <Tooltip title="Crop Image">
                            <Button
                                shape="circle"
                                icon={<ScissorOutlined/>}
                                onClick={handleCropButtonClick}
                                //     disabled={!detectorOutputImageUrl}
                            />
                        </Tooltip>
                        <Tooltip title="Delete Image">
                            <Button
                                shape="circle"
                                icon={<DeleteOutlined/>}
                                onClick={handleDeleteAllImagesClick}
                            />
                        </Tooltip>

                        <CameraCaptureModal
                            socketInstance={socketInstance}
                            isCameraCaptureModalOpen={isCameraCaptureModalOpen}
                            handleIsCameraCaptureModalOpen={handleIsCameraCaptureModalOpen}>
                        </CameraCaptureModal>
                    </div>

                </>

            )}

            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </Card>
    )
}

export const CameraCaptureForm = ({ form, 
                                    handleAllValuesChange, 
                                    exposureValue, handleExposureValue, 
                                    gainValue, handleGainValue, 
                                    focusValue, handleFocusValue }) => {
    const [autoExposure, setAutoExposure] = useState('Off');
    const [autoGain, setAutoGain] = useState('Off');
    const [autoFocus, setAutoFocus] = useState('Off');

    const handleAutoExposureChange = (e) => {
        setAutoExposure(e.target.value); // Update the auto exposure value
    };

    const handleAutoGainChange = (e) => {
        setAutoGain(e.target.value); // Update the auto gain value
    };

    const handleAutoFocusChange = (e) => {
        setAutoFocus(e.target.value); // Update the auto focus value
    };

    const handleExposureValueChange = (value) => {
        handleExposureValue(value); // Update the exposure value from the slider
    };

    const handleExposureInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            handleExposureValue(value); // Update the exposure value from the input box
        }
    };

    const handleGainValueChange = (value) => {
        handleGainValue(value); // Update the gain value from the slider
    };

    const handleGainInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            handleGainValue(value); // Update the gain value from the input box
        }
    };

    const handleFocusValueChange = (value) => {
        handleFocusValue(value); // Update the focus value from the slider
    };

    const handleFocusInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            handleFocusValue(value); // Update the focus value from the input box
        }
    };

    const handleValuesChange = (changedValues, allValues) => {
        handleAllValuesChange(allValues);
        console.log('CameraCaptureForm updated values:', allValues);
    };
  
    const onFinish = (values) => {
        console.log('Success:', values);
    };
  
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                remember: false,
            }}
            onValuesChange={handleValuesChange}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
        >
            <Form.Item label="Auto Exposure">
            <Radio.Group value={autoExposure} onChange={handleAutoExposureChange}>
                <Radio value="Off"> Off </Radio>
                <Radio value="On"> On </Radio>
            </Radio.Group>
            </Form.Item>

            {/* Auto Exposure [ms] Slider and Input */}
            <Form.Item label="Auto Exposure [ms]">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                    min={0}
                    max={81}
                    value={exposureValue}
                    onChange={handleExposureValueChange}
                    disabled={autoExposure === 'On'} // Disable when Auto Exposure is "On"
                    style={{ flex: 1 }}
                />
                <Input
                    type="number"
                    value={exposureValue}
                    onChange={handleExposureInputChange}
                    disabled={autoExposure === 'On'} // Disable when Auto Exposure is "On"
                    style={{ width: '80px', marginLeft: '10px' }}
                />
                </div>
            </Form.Item>

            <Form.Item label="Auto Gain">
            <Radio.Group value={autoGain} onChange={handleAutoGainChange}>
                <Radio value="Off"> Off </Radio>
                <Radio value="On"> On </Radio>
            </Radio.Group>
            </Form.Item>

            {/* Auto Gain Slider and Input */}
            <Form.Item label="Master Gain">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                    min={0}
                    max={49}
                    value={gainValue}
                    onChange={handleGainValueChange}
                    disabled={autoGain === 'On'} // Disable when Auto Gain is "OfOnf"
                    style={{ flex: 1 }}
                />
                <Input
                    type="number"
                    value={gainValue}
                    onChange={handleGainInputChange}
                    disabled={autoGain === 'On'} // Disable when Auto Gain is "On"
                    style={{ width: '80px', marginLeft: '10px' }}
                />
                </div>
            </Form.Item>

            <Form.Item label="Auto Focus">
            <Radio.Group value={autoFocus} onChange={handleAutoFocusChange}>
                <Radio value="Off"> Off </Radio>
                <Radio value="On"> On </Radio>
            </Radio.Group>
            </Form.Item>

            {/* Auto Focus Slider and Input */}
            <Form.Item label="Focus Setting">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                    min={0}
                    max={255}
                    value={focusValue}
                    onChange={handleFocusValueChange}
                    disabled={autoFocus === 'On'} // Disable when Auto Focus is "On"
                    style={{ flex: 1 }}
                />
                <Input
                    type="number"
                    value={focusValue}
                    onChange={handleFocusInputChange}
                    disabled={autoFocus === 'On'} // Disable when Auto Focus is "On"
                    style={{ width: '80px', marginLeft: '10px' }}
                />
                </div>
            </Form.Item>
        </Form>
    );
}

export const CameraCaptureModal = ({ socketInstance, isCameraCaptureModalOpen, handleIsCameraCaptureModalOpen}) => {
    const [form] = Form.useForm();
    const [videoFrameUrl, setVideoFrameUrl] = useState(null);
    const [userInput, setUserInput] = useState(null);
    const [exposureValue, setExposureValue] = useState(25);
    const [gainValue, setGainValue] = useState(1);
    const [focusValue, setFocusValue] = useState(205);

    const handleUserInput = (userInput) => {
        setUserInput(userInput);
    }

    const handleExposureValue = (exposureValue) => {
        setExposureValue(exposureValue);
    }

    const handleGainValue = (gainValue) => {
        setGainValue(gainValue);
    }

    const handleFocusValue = (focusValue) => {
        setFocusValue(focusValue);
    }

    const handleOnOk = () => {
        form.validateFields()
        .then(values => {
          console.log("on OK userInput: ", values);    
          console.log("CameraCaptureModal received userInput: ", values);
          try {
            if(socketInstance){
                // Now user input and signal triggering the capture are separately sent to cortex
                // socketInstance.emit('UserInputCameraCapture', { userInput: values });
                // console.log("sent 'UserInputCameraCapture' to cortex");
                const captureImageData = {"exposure": exposureValue, "gain": gainValue, "focus": focusValue};
                console.log("Capturing image and sending the config params: ", captureImageData);
                socketInstance.emit('CaptureImage', captureImageData);
            }
          } catch (error) {
            console.error('Error:', error);
          }
          handleIsCameraCaptureModalOpen(false);

          console.log("Stopping streaming.");
          socketInstance.emit('StopCaptureVideo');
        })
        .catch(info => {
          console.error('Validate Failed:', info);
        });
    };

    const handleOnCancel = () => {    
        console.log("CameraCaptureModal received userInput: ", false);
        // Should not send anything back to the cortex
        // try {
        //   if(socketInstance){
        //     socketInstance.emit('CaptureImage', false);
        //   }
        // } catch (error) {
        //   console.error('Error:', error);
        // }  
        handleIsCameraCaptureModalOpen(false);

        console.log("Stopping streaming.");
        socketInstance.emit('StopCaptureVideo');
      };

    const handleAllValuesChange = (allValues) => {
        console.log('CameraCaptureModal updated values:', allValues);
        handleUserInput(allValues);    
    };

    useEffect(() => {

        if (socketInstance && isCameraCaptureModalOpen) {
            console.log("Starting streaming...");
            socketInstance.emit('CaptureVideo');

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
    }, [socketInstance, isCameraCaptureModalOpen]);

    return (
        <Modal
          title="Capture Image"
          centered
          open={isCameraCaptureModalOpen} 
          onOk={handleOnOk} 
          onCancel={handleOnCancel}
          maskClosable={false}
          closable={false}
          width = '70%'
          height = '70%'
        >
            <div style={{ display: 'flex' }}>
                {/* Left side: Camera settings form */}
                <div style={{ flex: 1 }}>
                    <CameraCaptureForm form={form} 
                                handleAllValuesChange={handleAllValuesChange} 
                                exposureValue={exposureValue}
                                handleExposureValue={handleExposureValue}
                                gainValue={gainValue}
                                handleGainValue={handleGainValue}
                                focusValue={focusValue}
                                handleFocusValue={handleFocusValue}/>
                
                    <Button 
                        type="primary" 
                    >
                        Set Camera
                    </Button>
                </div>

                {/* Right side: Video panel */}
                <div style={{ flex: 1, marginLeft: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                </div>
            </div>
        </Modal>
      );
}

export const TemplateMatcherViewer = ({socketInstance, handleDetectorInputImagesUrls}) => {
    const [detectorOutputImagesUrls, setDetectorOutputImagesUrls] = useState([]);
    const [isCropping, setIsCropping] = useState(false);
    const cropperRef = useRef(null);
    const [isCameraCaptureModalOpen, setIsCameraCaptureModalOpen] = useState(false);

    const handleIsCameraCaptureModalOpen = (cameraCaptureModalOpenFlag) => {
        setIsCameraCaptureModalOpen(cameraCaptureModalOpenFlag);
    }

    const handleDetectorOutputImagesUrls = (outputImagesUrls, shouldReplace = false) => {
        if (outputImagesUrls === null) {
            setDetectorOutputImagesUrls([]);
        } else if (shouldReplace) {
            setDetectorOutputImagesUrls(outputImagesUrls);
        } else {
            setDetectorOutputImagesUrls(prevImages => [...prevImages, ...outputImagesUrls]);
        }
    };

    useEffect(() => {
        console.log('Detector Output Images Urls:', detectorOutputImagesUrls);
    }, [detectorOutputImagesUrls]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Print out the file names for diagnosis
        files.forEach(file => {
            console.log('File selected:', file.name);
        });

        const imagesUrls = files.map(file => URL.createObjectURL(file));
        handleDetectorOutputImagesUrls(imagesUrls, false);
        handleDetectorInputImagesUrls(imagesUrls, false);
        console.log("Uploaded images");
        setIsCropping(false);
    };

    const handleUploadImageClick = () => {
        // Click the hidden file input element
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCaptureImageClick = () => {
        console.log("CameraCaptureModal shows up");
        handleIsCameraCaptureModalOpen(true);
    }

    const handleDeleteImageClick = (index) => {
        // Remove multiple output images (either the input or processed images)
        const updatedImages = detectorOutputImagesUrls.filter((_, i) => i !== index);
        handleDetectorOutputImagesUrls(updatedImages, true);
        // Remove multiple output images (only the input images)
        handleDetectorInputImagesUrls(updatedImages, true);
    }

    const handleDeleteAllImagesClick = () => {
        // Remove multiple output images (either the input or processed images)
        handleDetectorOutputImagesUrls(null);
        // Remove multiple output images (only the input images)
        handleDetectorInputImagesUrls(null);
    }


    const fileInputRef = React.createRef();

    const handleCapturedImageUrl = (capturedImageData) => {
        console.log("Received captured image data in DetectorViewer: ", capturedImageData);
        const imageUrl = URL.createObjectURL(new Blob([capturedImageData.image]));
        handleDetectorOutputImagesUrls([imageUrl], true);
        handleDetectorInputImagesUrls([imageUrl], true);

    }

    const handleDetectorOutputImageUrl = (imageData) => {
        console.log("Received image data in DetectorViewer: ", imageData);

        // Preprocess multiple images
        if (imageData && Array.isArray(imageData.images)) {
            console.log("Received ", imageData.images.length, "images");

            const newImages = imageData.images.map((singleImageData) =>
                URL.createObjectURL(new Blob([singleImageData]))
            );
            handleDetectorOutputImagesUrls(newImages, true);
        } else if (imageData && imageData.image) {
            console.log("Received a single image.");
            const imageBlob = URL.createObjectURL(new Blob([imageData.image]));
            handleDetectorOutputImagesUrls([imageBlob], true);
        } else {
            console.log("Unexpected format of imageData or no images received.");
        }
    };

    const handleCropButtonClick = () => {
        setIsCropping(true);
        console.log("crop button clicked");
    }

    const handleCropImage = () => {
        if (cropperRef.current) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            if (croppedCanvas) {
                const croppedImage = croppedCanvas.toDataURL();
                handleDetectorOutputImagesUrls([croppedImage], true);
                handleDetectorInputImagesUrls([croppedImage], true);
                setIsCropping(false);
            }
        }
    };

    useEffect(() => {
        console.log('Socket Instance received data.');
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }

        // Event listener
        socketInstance.on('CapturedImage', handleCapturedImageUrl)
        socketInstance.on('DetectorImage', handleDetectorOutputImageUrl);
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('CapturedImage', handleCapturedImageUrl);
            socketInstance.off('DetectorImage', handleDetectorOutputImageUrl);
        };

    }, [socketInstance]);

    return (
        <Card
            size="small"
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {isCropping ? (
                <div>
                    <Cropper
                        src={detectorOutputImagesUrls[0]}
                        style={{ height: '100%', width: '100%', objectFit: 'contain', borderRadius: '6px' }}
                        initialAspectRatio={1}
                        guides={true}
                        ref={cropperRef}
                    />
                    <Button onClick={handleCropImage}>Crop Image</Button>
                </div>
            ):(
                <>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column',
                            overflow: 'auto',
                            // gap: '10px',
                        }}
                    >
                        {detectorOutputImagesUrls.map((imageUrl, index) => (
                            <div key={index} style={{position: 'relative'}}>
                                <img
                                    alt="detector"
                                    src={imageUrl}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
                                />
                                <Button
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        zIndex: 1
                                    }}
                                    shape="circle"
                                    icon={<DeleteOutlined/>}
                                    onClick={() => handleDeleteImageClick(index)}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <Tooltip title="Upload Image">
                            <Button
                                shape="circle"
                                icon={<UploadOutlined/>}
                                onClick={handleUploadImageClick}
                            />
                        </Tooltip>
                        <Tooltip title="Capture Image">
                            <Button
                                shape="circle"
                                icon={<CameraOutlined/>}
                                onClick={handleCaptureImageClick}
                            />
                        </Tooltip>
                        <Tooltip title="Crop Image">
                            <Button
                                shape="circle"
                                icon={<ScissorOutlined/>}
                                onClick={handleCropButtonClick}
                                //     disabled={!detectorOutputImageUrl}
                            />
                        </Tooltip>
                        <Tooltip title="Delete Image">
                            <Button
                                shape="circle"
                                icon={<DeleteOutlined/>}
                                onClick={handleDeleteAllImagesClick}
                            />
                        </Tooltip>

                        <CameraCaptureModal
                            socketInstance={socketInstance}
                            isCameraCaptureModalOpen={isCameraCaptureModalOpen}
                            handleIsCameraCaptureModalOpen={handleIsCameraCaptureModalOpen}>
                        </CameraCaptureModal>
                    </div>

                </>

            )}

            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </Card>
    )
}

export const SolvePnPPoseEstimationViewer = ({socketInstance}) => {

    return (
        <Card
            size="small"
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            <>
                {/* This is where you put the 3d point cloud and the functional panels. */}
            </>
        </Card>
    )
}




export const ClusteredICPPoseEstimationViewer = ({socketInstance, handleDetectorInputPointCloud, viewPcdCenterX, viewPcdCenterY, viewPcdCenterZ, filterRadius}) => {
    const [detectorOutputPcdUrl, setDetectorOutputPcdUrl] = useState(null);
    const [pcdData, setPcdData] = useState(null);
    const fileInputRef = React.createRef();
    const [detectorIcpPcd, setDetectorIcpPcd] = useState();


    useEffect(() => {
        if (detectorOutputPcdUrl) {
          const reader = new FileReader();
          reader.onload = () => {
            const loader = new PCDLoader();
            const loadedPointCloud = loader.parse(reader.result);
            
            const positionAttribute = loadedPointCloud.geometry.attributes.position;
            // console.log(Object.keys(positionAttribute.array));
            const colorAttribute = loadedPointCloud.geometry.attributes.color;
            const vertices = [];
            const colors = [];
            
            for (let i = 0; i < positionAttribute.count; i++) {
              vertices.push([
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
              ]);
              if (colorAttribute) {
                colors.push([
                  colorAttribute.getX(i),
                  colorAttribute.getY(i),
                  colorAttribute.getZ(i)
                ]);
              } else {
                // Default color if no color attribute is present
                colors.push([1, 1, 1]); // White
              }
            
        }
            const Pcd={vertices:vertices,colors:colors}
            const compressedPcd=JSON.stringify(Pcd)
            // console.log(compressedPcd);
            
            handleDetectorInputPointCloud(Pcd)
            
            console.log("starting data send");
            socketInstance.emit('UploadedPointCloud', compressedPcd );
            console.log(" data sent");
            setPcdData(loadedPointCloud);
      
          };
          
          reader.readAsArrayBuffer(detectorOutputPcdUrl);
        }   
      },[detectorOutputPcdUrl]);

    useEffect(() => {
        console.log('Socket Instance received data.');
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }

        // Event listener
        socketInstance.on('DetectorPcd', handleDetectorIcpPcd);
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('DetectorPcd', handleDetectorIcpPcd);
        };

    }, [socketInstance]);   
    
    
    const handleDetectorIcpPcd= (data)=>{
        console.log("Data Recieved",typeof data);
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(data.length * 3);
        const colors = new Float32Array(data.length * 3);
    
        data.forEach((point, index) => {
          vertices[index * 3] = point.x;
          vertices[index * 3 + 1] = point.y;
          vertices[index * 3 + 2] = point.z;
          colors[index * 3] = point.r;
          colors[index * 3 + 1] = point.g;
          colors[index * 3 + 2] = point.b;
        });
    
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
        const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
        const recieved_pcd=new THREE.Points(geometry, material)
        setDetectorIcpPcd(recieved_pcd)
        
    }

    const handleFileChange =async (e) => {
        const file = e.target.files[0];

        if (file) {
            console.log('File selected:', file);
            setDetectorOutputPcdUrl(file);
            console.log("Uploaded Point Cloud")
        }
    };

    const handleUploadPcdClick = () => {
        // Click the hidden file input element
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    

    const handleDeletePcdClick = (index) => {
        setDetectorOutputPcdUrl(null);
        handleDetectorInputPointCloud(null);
        setDetectorIcpPcd(null)
        setPcdData(null)
    }

    const OpaqueGrid = () => {
        const gridRef = useRef();
      
        useFrame(() => {
          if (gridRef.current) {
            gridRef.current.position.set(viewPcdCenterX,viewPcdCenterY,viewPcdCenterZ);
            const { material } = gridRef.current;
            if (material.opacity !== 0.1 || !material.transparent) {
              material.opacity = 0.1;
              material.transparent = true;
              material.needsUpdate = true;  // Ensure the material updates
            }
          }
        });
      
        return (
          <gridHelper
            ref={gridRef}
            args={[100000, 1000, 0x52c41a, 0xffffff]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        );
    };
    
    const Environment = ({cameraPosition}) => {
        return (
            <group name="Environment">
                <PerspectiveCamera 
                    makeDefault 
                    position={cameraPosition} 
                    fov={45}
                    near={0.01}
                    far={1000}
                />            
                <hemisphereLight 
                    skyColor={0xfffff} 
                    groundColor={0xfffff} 
                    intensity={0.5} 
                    position={[10, 10, 10]} 
                />
    
                <directionalLight 
                    color={0xffffff} 
                    intensity={5} 
                    position={[10, 10, 10]} 
                />
                <OpaqueGrid/> 
                <GizmoHelper alignment="top-right" margin={[100, 100]}>
                    <GizmoViewport labelColor="white" axisHeadScale={1} />
                </GizmoHelper>
                <mesh position={[viewPcdCenterX,viewPcdCenterY,viewPcdCenterZ]}>
                <sphereGeometry args={[10, 32, 32]} />
                <meshBasicMaterial color="blue" />
                </mesh>
                <mesh position={[viewPcdCenterX,viewPcdCenterY,viewPcdCenterZ]}>
                <sphereGeometry args={[filterRadius, 32, 32]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.3} />
                </mesh>
            </group>
        )
    };

    const Background = () => {
        const { gl } = useThree(); // Access the WebGLRenderer
        useEffect(() => {
        gl.setClearColor('#313131'); // Set the background color to black
        }, [gl]);
    return null; // This component does not render anything visible
  };
  
  const CameraController = () => {
    const { camera } = useThree();
    useEffect(() => {
      // Adjust the camera's near and far clipping planes
      camera.position.set(viewPcdCenterX,viewPcdCenterY,viewPcdCenterZ+1500); 
      camera.near = 0.1; // Default is often 0.1
      camera.far = 5000; // Increase this value if the point cloud is large
      camera.lookAt(10,-50,-400)
      camera.updateProjectionMatrix();
    }, [camera]);
  
    return null; // This component does not render anything visible
  };

 

  

    return (
        
        <> 
                <>
                    { detectorOutputPcdUrl 
                         ? (
                        <div style={{
                            flex: 1,
                            height:"100%",
                            "border-radius":"30px"
                        }}>{!pcdData ? (<> 
                        <div style={{
                                position: 'relative',
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                "flex-direction": "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '6px',
                                overflow: 'auto'}}>

                                <Skeleton.Image active={true} />
                                <h4>Loading....</h4>
                            </div>
                        </>):(
                            <Canvas style={{ borderRadius: '6px',width: '100%',overflow: 'auto',position: 'relative',display: 'flex',flexDirection: 'column',flex: 1,}}>
                                <Background /> 
                                <CameraController makeDefault /> 
                                {/* <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} /> */}
                                {!detectorIcpPcd? <primitive object={pcdData} />:(<><primitive object={detectorIcpPcd} /><primitive object={pcdData} /></>)}
                                <Environment name="Environment" cameraPosition={[2, -2, 2]}/>
                                <OrbitControls
                                  makeDefault
                                  enableZoom={true}
                                  zoomSpeed={1.2}
                                  minDistance={0.5}  // Minimum distance the camera can zoom in
                                  maxDistance={2000} // Maximum distance the camera can zoom out
                                />
                            </Canvas>
                            
                            )}
                        </div>
                    ): <Card style={{
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '6px',
                        overflow: 'auto'}}>    
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                        <Typography.Text style={{color: '#888'}}>
                                            Please upload the point cloud from upload button.
                                        </Typography.Text>}
                        
                        >
                        </Empty>
                        </Card>}
                    <div style={{ position: 'absolute', top: '40px', left: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Tooltip title="Upload Point Cloud">
                            <Button
                                shape="circle"
                                icon={<UploadOutlined />}
                                onClick={handleUploadPcdClick}
                            />
                        </Tooltip>
                        
                        <Tooltip title="Delete Point Cloud">
                            <Button
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={handleDeletePcdClick}
                            />
                        </Tooltip>
                    </div>

                </>
            <input
                type="file" accept=".pcd"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
            </>
        
    )

}