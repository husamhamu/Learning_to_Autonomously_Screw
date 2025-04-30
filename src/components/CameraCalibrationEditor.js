import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Card,
    Checkbox,
    Form, 
    Input, 
    InputNumber, 
    Flex, 
    Button, 
    Divider, 
    Select, 
    Tree, 
    Typography, 
    Tooltip, 
    Empty, 
    Col, 
    Row, 
    Slider, 
    Space
} from "antd"
import {CameraOutlined, PlusOutlined, VideoCameraAddOutlined} from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;

 const RandomSphericalSampler = () => {
    return(
        <>
            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="X min"
                        name="x_min"
                        initialValue={-0.15}
                        tooltip="Minimum value of the position range of the camera in the X direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="X max"
                        name="x_max"
                        initialValue={0.15}
                        tooltip="Maximum value of the position range of the camera in the X direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item> 

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Y min"
                        name="y_min"
                        initialValue={-0.15}
                        tooltip="Minimum value of the position range of the camera in the Y direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Y max"
                        name="y_max"
                        initialValue={0.15}
                        tooltip="Maximum value of the position range of the camera in the Y direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item> 

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Z min"
                        name="z_min"
                        initialValue={0.2}
                        tooltip="Minimum value of the position range of the camera in the Z direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Z max"
                        name="z_max"
                        initialValue={0.35}
                        tooltip="Maximum value of the position range of the camera in the Z direction with respect
                        to the calibration board in robot base frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Rx min"
                        name="rx_min"
                        initialValue={-15}
                        tooltip="Minimum value of the rotation range of the camera in the around its X axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Rx max"
                        name="rx_max"
                        initialValue={15}
                        tooltip="Maximum value of the rotation range of the camera around its X axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Ry min"
                        name="ry_min"
                        initialValue={-15}
                        tooltip="Minimum value of the rotation range of the camera around its Y axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Ry max"
                        name="ry_max"
                        initialValue={15}
                        tooltip="Maximum value of the rotation range of the camera around its Y axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Rz min"
                        name="rz_min"
                        initialValue={-15}
                        tooltip="Minimum value of the rotation range of the camera around its Z axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                    <Form.Item
                        label="Rz max"
                        name="rz_max"
                        initialValue={15}
                        tooltip="Maximum value of the rotation range of the camera around its Z axis in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                label="Sampler Radius"
                name="radius"
                initialValue={0.37}
                tooltip="Radius of the sphere from the center of the chessboard around from which camera poses are sampled in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>

            <Form.Item
                label="Sampler Radius Variation"
                name="radius_variance"
                initialValue={0.1}
                tooltip="Variation of the radius of the sphere from the center of the chessboard around from which camera poses are sampled in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>
        </>
    )
}

const CircularSampler = () => {
    return(
        <>
            <Form.Item
                label="Radius"
                name="radius"
                initialValue={0.37}
                tooltip="Radius of the circle from the center of the chessboard around from which camera poses are sampled in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>

            <Form.Item
                label="Circle Height"
                name="circle_height"
                initialValue={0.3}
                tooltip="The height of the circle to be sampled from measured from the center of the chessboard in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>
        </>
    )
}

const ConicalSampler = () => {
    return(
        <>
            <Form.Item
                label="Radius 1"
                name="radius1"
                initialValue={0.18}
                tooltip="Radius of the first circle from the center of the chessboard around from which camera poses are sampled in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>

            <Form.Item
                label="Circle Height 1"
                name="circle_height1"
                initialValue={0.3}
                tooltip="The height of the first circle to be sampled from measured from the center of the chessboard in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>
            <Form.Item
                label="Radius 2"
                name="radius2"
                initialValue={0.12}
                tooltip="Radius of the second circle from the center of the chessboard around from which camera poses are sampled in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>

            <Form.Item
                label="Circle Height 2"
                name="circle_height2"
                initialValue={0.25}
                tooltip="The height of the second circle to be sampled from measured from the center of the chessboard in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>
        </>
    )
}

const ConicalGeneralizedSampler = () => {
    return(
        <>
            <Form.Item
                label="Circle Height 1"
                name="circle_height1"
                initialValue={0.22}
                tooltip="The height of the first circle to be sampled from measured from the center of the chessboard in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Target Point X1"
                        name="target_circle_point_x1"
                        initialValue={-0.04}
                        tooltip="X coordinate of the target point wrt the coordinate frame of the chessboard in meter"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Target Point Y1"
                        name="target_circle_point_y1"
                        initialValue={0.0}
                        tooltip="X coordinate of the target point wrt the coordinate frame of the chessboard in meter"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Ellipse Radius X1"
                        name="radius_x1"
                        initialValue={0.08}
                        tooltip="Radius in x of the first ellipses (center: (Target Point X1, Target Point Y1)) corresponding to one height level from the center of the chessboard around from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Ellipse Radius Y1"
                        name="radius_y1"
                        initialValue={0.04}
                        tooltip="Radius in x of the first ellipses (center: (Target Point X1, Target Point Y1)) corresponding to one height level from the center of the chessboard around from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Rectangle Width 1"
                        name="rectangle_width1"
                        initialValue={0.105}
                        tooltip="Width of the first rectangle (centered at chessboard origin) from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Rectangle Height 1"
                        name="rectangle_height1"
                        initialValue={0.08}
                        tooltip="Hight of the first rectangle (centered at chessboard origin) from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                label="Circle Height 2"
                name="circle_height2"
                initialValue={0.28}
                tooltip="The height of the second circle to be sampled from measured from the center of the chessboard in meters"
            >
                <InputNumber style={{ width: '100%' }} step={0.01}/>
            </Form.Item>
            
            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Target Point X2"
                        name="target_circle_point_x2"
                        initialValue={-0.05}
                        tooltip="X coordinate of the target point wrt the coordinate frame of the chessboard in meter"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Target Point Y2"
                        name="target_circle_point_y2"
                        initialValue={0.0}
                        tooltip="X coordinate of the target point wrt the coordinate frame of the chessboard in meter"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Ellipse Radius X2"
                        name="radius_x2"
                        initialValue={0.10}
                        tooltip="Radius in x of the ellipses corresponding to the second height level from the center of the chessboard around from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Ellipse Radius Y2"
                        name="radius_y2"
                        initialValue={0.05}
                        tooltip="Radius in y of the ellipses corresponding to the second height level from the center of the chessboard around from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Rectangle Width 2"
                        name="rectangle_width2"
                        initialValue={0.175}
                        tooltip="Width of the second rectangle (centered at chessboard origin) from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>

                    <Col span={10} style={{ textAlign: 'middle' }}>
                    <Form.Item
                        label="Rectangle Height 2"
                        name="rectangle_height2"
                        initialValue={0.12}
                        tooltip="Hight of the second rectangle (centered at chessboard origin) from which camera poses are sampled in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
        </>
    )
}

export const CameraCalibrationOutliner = ({
    handleShowCameraCalibrationEditor,
    cameraCalibrationTreeData,
}) => {
    const [isCameraCalibrationTreeAdded, setIsCameraCalibrationTreeAdded] = useState(false);

    // Define the click handler function
    const handleClick = () => {
        setIsCameraCalibrationTreeAdded(true);
        console.log('Adding camera calibration clicked');
        handleShowCameraCalibrationEditor(true);
    }

    // Handle search change
    const onChange = (e) => {
        console.log('Searching camera calibration clicked');
    };
    

    const treeData = useMemo(() => {
        console.log('Newly assigned detector tree data: ', cameraCalibrationTreeData);
        if (!cameraCalibrationTreeData || !Array.isArray(cameraCalibrationTreeData) || cameraCalibrationTreeData.length === 0) {
          console.log('Newly assigned detector tree data is null')
          return [];
        }
    
        const loop = (data) =>
            data.map(item => {
              const strTitle = item.name;
              const title =
                  <span>{strTitle}</span>;
              if (item.children) {
                return {
                  title,
                  key: item.name,
                  children: loop(item.children),
                };
              }
              return {
                title,
                key: item.name,
              };
            });
    
        return loop(cameraCalibrationTreeData);
      }, [cameraCalibrationTreeData]);

    return (
        <Flex gap="small" direction="column" align="center" vertical>
            <Flex gap="small" align="start" style={{ width: '100%' }}>
                <Button icon={<PlusOutlined />}
                        onClick={handleClick}
                        type="primary"
                        size='small'
                >
                        Add Calibration
                </Button>
                <Search 
                    style={{ marginBottom: 8 }} 
                    size="small" 
                    placeholder="Search" 
                    onChange={onChange} />
            </Flex>
            {isCameraCalibrationTreeAdded ? (
                <Tree
                    checkable
                    // onExpand={onExpand}
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    // onCheck={onCheck}
                    // checkedKeys={checkedKeys}
                    // onSelect={onSelect}
                    // selectedKeys={selectedKeys} icon={<PlusOutlined />
                    treeData={treeData}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text style={{ color: '#888' }}>
                            Please add calibration by clicking <PlusOutlined style={{ fontSize: '1em' }} /> Add Calibration.
                        </Typography.Text>
                    }
                >
                </Empty>
            )}
        </Flex>
    )
}


export const CameraCalibrationEditor = ({
    socketInstance,
    showCameraCalibrationEditor, 
    handleShowCameraCalibrationEditor,
    handleCameraCalibrationTreeData,
}) => {
    const [form] = Form.useForm();
    const [cameraCalibrationData, setCameraCalibrationData] = useState({})  
    const [formValues, setFormValues] = useState({ capture_images: 'True' });
  

    const handleCameraCalibrationData = (data) => {
        setCameraCalibrationData(data);
    }

    const handleValuesChange = async (changedValues, allValues) => {
        console.log('CameraCalibrationForm allValues: ', allValues);
        setFormValues(allValues);
        handleCameraCalibrationData(allValues);
    };

    const handleSaveCameraCalibrationClick = () => {
        socketInstance.emit('SaveCameraCalibration', cameraCalibrationData);
        console.log("Saving camera calibration: ", cameraCalibrationData.name)
        handleCameraCalibrationTreeData(cameraCalibrationData.name)
        //  handleShowCameraCalibrationEditor(false);
    }

    const handleCalibrateClick = () => {
        socketInstance.emit('CalibrateCamera', cameraCalibrationData);
    }

    const handleCancelClick = () => {
        socketInstance.emit('CancelCameraCalibrationClick', cameraCalibrationData);
        handleShowCameraCalibrationEditor(false);
    }

    return (
        <div>
            {showCameraCalibrationEditor ? (

            <Flex gap="small" vertical >
            
            <Form 
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                    span: 14,
                }}
                wrapperCol={{
                    span: 32,
                }}
                style={{width: '100%'}}
            >
                    <Form.Item 
                        label="Calibration Settings Name" 
                        name="name" 
                        initialValue={"Calibration Settings"}
                        tooltip="Enter the name for the calibration settings"
                    >
                        <Input style={{width: '100%'}} />
                    </Form.Item>

                    <Divider>Calibration Type</Divider>

                    <Form.Item 
                        label="Extrinsic Calibration Type" 
                        name="extrinsic_calibration_type" 
                        initialValue={"Eye in Hand"}
                        tooltip="Eye in Hand represents camera mounted on the robot. Eye to Hand represents a camera looking at the environment"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Eye in Hand">Eye in Hand</Option>
                            <Option value="Eye to Hand">Eye to Hand</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Capture Images" 
                        name="capture_images" 
                        initialValue={"True"}
                        tooltip="If true, move the robot to capture images and record tcp poses. If false, load load the path to a dataset containg images tcp poses"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="True">True</Option>
                            <Option value="False">False</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Save Images and Poses" 
                        name="save_images_poses" 
                        valuePropName="checked"
                        tooltip="If true, move the robot to capture images and record tcp poses. If false, load the path to a dataset containg images tcp poses"
                    >
                        <Checkbox ></Checkbox>
                    </Form.Item>

                    {formValues.save_images_poses === 'true' && (

                    <Form.Item 
                        label=" Save Data Path" 
                        name="save_data_path" 
                        initialValue={9} 
                        tooltip="Number of rows in the calibration board"
                    >
                        <InputNumber style={{width: '100%'}} />
                    </Form.Item>
                    )}

                    <Divider>Calibration Board</Divider>

                    <Form.Item 
                        label="Number of Rows" 
                        name="chessboard_rows" 
                        initialValue={6} 
                        tooltip="Number of rows in the calibration board. Note: it requires to be one less than the actual row number."
                    >
                        <InputNumber style={{width: '100%'}} />
                    </Form.Item>

                    <Form.Item 
                        label="Number of Columns" 
                        name="chessboard_cols" 
                        initialValue={5}
                        tooltip="Number of columns in the calibration board. Note: it requires to be one less than the actual row number."
                    >
                        <InputNumber style={{width: '100%'}} />
                    </Form.Item>

                    <Form.Item 
                        label="Square Size" 
                        name="chessboard_square_size" 
                        initialValue={20}
                        tooltip="Size of the square of the calibration board in millimeters"
                    >
                        <InputNumber style={{width: '100%'}} />
                    </Form.Item>

                    {formValues.capture_images === 'True' && (
                    <>
                        <Divider>Static Poses</Divider>
                        
                        <Form.Item
                            label="Home Position X"
                            name="home_position_x"
                            initialValue={0.55}
                            tooltip="X position of the home frame which the TCP returns to after each camera capture in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Y"
                            name="home_position_y"
                            initialValue={-0.015}
                            tooltip="Y position of the home frame which the TCP returns to after each camera capture in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Z"
                            name="home_position_z"
                            initialValue={0.3}
                            tooltip="Z position of the home frame which the TCP returns to after each camera capture in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Home Rotation Rx"
                            name="home_rotation_rx"
                            initialValue={0}
                            tooltip="Rotation around X axis of the home frame which the TCP returns to after each camera capture in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Ry"
                            name="home_rotation_ry"
                            initialValue={-180}
                            tooltip="Rotation around Y axis of the home frame which the TCP returns to after each camera capture in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Rz"
                            name="home_rotation_rz"
                            initialValue={90}
                            tooltip="Rotation around Z axis of the home frame which the TCP returns to after each camera capture in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        </>)}
                        {formValues.capture_images === 'True' && (
                    
                    <>
                        <Form.Item
                            label="Chessboard Position X"
                            name="chessboard_center_x"
                            initialValue={0.55}
                            tooltip="X position of the center of the calibration board in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Y"
                            name="chessboard_center_y"
                            initialValue={-0.015}
                            tooltip="Y position of the center of the calibration board in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Z"
                            name="chessboard_center_z"
                            initialValue={-0.018}
                            tooltip="Z position of the center of the calibration board in robot base frame in meters"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>

                        <Form.Item
                            label="Chessboard Rotation Rx"
                            name="chessboard_center_rx"
                            initialValue={0}
                            tooltip="Rotation around X axis of the center of the calibration board in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Ry"
                            name="chessboard_center_ry"
                            initialValue={0}
                            tooltip="Rotation around Y axis of the center of the calibration board in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Rz"
                            name="chessboard_center_rz"
                            initialValue={2}
                            tooltip="Rotation around Z axis of the center of the calibration board in robot base frame in degrees"
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </>)}

                        {formValues.capture_images === 'True' && (
                        <>
                        <Divider>Sampler</Divider>

                        <Form.Item 
                            label="Sampler Type"
                            name="sampler_type" 
                            initialValue={"Circular"}
                            tooltip="Method used for collecting images"
                        >
                            <Select style={{width: '100%'}} >
                                <Option value="Circular">Circular</Option>
                                <Option value="Conical">Conical</Option>
                                <Option value="Conical Generalized">Conical Generalized</Option>
                                <Option value="Random">Random</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Number of Samples"
                            name="num_samples"
                            initialValue={10}
                            tooltip="Number of samples to be collected for calibration"
                        >
                            <InputNumber style={{ width: '100%' }} />
                         </Form.Item>

                        {formValues.sampler_type === 'Random' && (
                            <RandomSphericalSampler/>
                        )}

                        {formValues.sampler_type === 'Circular' && (
                            <CircularSampler/>
                        )}

                        {formValues.sampler_type === 'Conical' && (
                            <ConicalSampler/>
                        )}

                        {formValues.sampler_type === 'Conical Generalized' && (
                            <ConicalGeneralizedSampler/>
                        )}
                        </>)}
                        {formValues.capture_images === 'True' && (
                    
                            <>
                                <Divider>Camera Settings</Divider>

                                <Form.Item
                                    label="Focus Range"
                                    name="camera_focus_range"
                                    initialValue={205}
                                    tooltip="Focus range of the camera in between 0 and 255"
                                >
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    label="Exposure"
                                    name="camera_exposure"
                                    initialValue={6}
                                    tooltip="Exposure of the camera in milliseconds"
                                >
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    label="Gain"
                                    name="camera_gain"
                                    initialValue={1}
                                    tooltip="Gain of the camera in between 1 and 45"
                                >
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                            </>
                         )}


                    <Divider>Intrinsic Calibration Parameters</Divider>
                    <Form.Item
                        label="Per View Error Threshold"
                        name="per_view_error_threshold"
                        initialValue={1.0}
                        tooltip="Upper threshold for the reprojection error per view in pixels"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Chessboard Corner Detection" 
                        name="chessboard_corner_detector" 
                        initialValue={"Default"}
                        tooltip="TODO"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Default">Default</Option>
                            <Option value="Sector Based">Sector Based</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Intrinsic Calibration Method" 
                        name="intrinsic_calibrate_camera_method" 
                        initialValue={"Default"}
                        tooltip="TODO"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Default">Default</Option>
                            <Option value="Release Object">Release Object</Option>
                        </Select>
                    </Form.Item>

                    <Divider plain>Initial Intrinsics Guess</Divider>
                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Fx"
                            name="fx_guess"
                            initialValue={3463.63}
                            tooltip="Initial guess for the focal length on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Fy"
                            name="fy_guess"
                            initialValue={3463.63}
                            tooltip="Initial guess for the focal length on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>
                    
                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Cx"
                            name="cx_guess"
                            initialValue={2100}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.1}/>
                        </Form.Item>
                        </Col>
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Cy"
                            name="cy_guess"
                            initialValue={1560}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.1}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Divider plain>Initial Distortion Coefficients Guess</Divider>
                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K1"
                            name="k1_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K2"
                            name="k2_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K3"
                            name="k3_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="P1"
                            name="p1_guess"
                            initialValue={0}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="P2"
                            name="p2_guess"
                            initialValue={0}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K4"
                            name="k4_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K5"
                            name="k5_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={7} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="K6"
                            name="k6_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="S1"
                            name="s1_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="S2"
                            name="s2_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="S3"
                            name="s3_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="S4"
                            name="s4_guess"
                            initialValue={0.}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="TauX"
                            name="tauX_guess"
                            initialValue={0}
                            tooltip="Initial guess for the image center on the x axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                        <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="TauY"
                            name="tauY_guess"
                            initialValue={0}
                            tooltip="Initial guess for the image center on the y axis of cameraMatrix in pixels"
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01}/>
                        </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    {/* <Form.Item 
                        label="Use Intrinsic Guess" 
                        name="use_intrinsic_guess" 
                        valuePropName="checked"
                        tooltip="If true, an initial guess is used for calculating the intrinsic matrix"
                    >
                        <Checkbox ></Checkbox>
                    </Form.Item> */}

                    <Divider plain>Calibration Constraint</Divider>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Use Intrinsic Guess" 
                            name="CALIB_USE_INTRINSIC_GUESS" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, further optimize fx, fy, cx, cy, which should be the valid initial values of cameraMatrix."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix Aspect Ratio" 
                            name="CALIB_FIX_ASPECT_RATIO" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the functions consider only fy as a free parameter. The ratio fx/fy stays the same as in the input cameraMatrix . 
                            When 'Use Intrinsic Guess' is not checked, the actual input values of fx and fy are ignored, only their ratio is computed and used further."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix Principal Point" 
                            name="CALIB_FIX_PRINCIPAL_POINT" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix Focal Length" 
                            name="CALIB_FIX_FOCAL_LENGTH"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Zero Tangent Distortion" 
                            name="CALIB_ZERO_TANGENT_DIST" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Use Rational Model" 
                            name="CALIB_RATIONAL_MODEL"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K1" 
                            name="CALIB_FIX_K1" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K2" 
                            name="CALIB_FIX_K2"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K3" 
                            name="CALIB_FIX_K3" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K4" 
                            name="CALIB_FIX_K4"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K5" 
                            name="CALIB_FIX_K5" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix K6" 
                            name="CALIB_FIX_K6"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Use Thin Prism Model" 
                            name="CALIB_THIN_PRISM_MODEL" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix S1 S2 S3 S4" 
                            name="CALIB_FIX_S1_S2_S3_S4"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Use Tilted Model" 
                            name="CALIB_TILTED_MODEL" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix TauX TauY" 
                            name="CALIB_FIX_TAUX_TAUY"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix Tangent Tistortion" 
                            name="CALIB_FIX_TANGENT_DIST" 
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the principal point is not changed during the global optimization. It stays at the center or at a different location 
                            specified when 'Use Intrinsic Guess' is checked too."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={10} style={{ textAlign: 'middle' }}>
                            <Form.Item 
                            label="Fix Intrinsic" 
                            name="CALIB_FIX_INTRINSIC"
                            valuePropName="checked"
                            initialValue={false}
                            tooltip="If true, the focal length is not changed during the global optimization if 'Use Intrinsic Guess' is checked."
                            >
                                <Checkbox ></Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form.Item>

                    <Divider>Initial Extrinsic Estimation</Divider>
  
                    <Form.Item
                        label="Estimated Camera Pose X"
                        name="estimated_camera_pose_tcp_x"
                        initialValue={0.0029}
                        tooltip="Estimated X position of the camera in TCP frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>

                    <Form.Item
                        label="Y"
                        name="estimated_camera_pose_tcp_y"
                        initialValue={-0.1158}
                        tooltip="Estimated Y position of the camera in TCP frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>

                    <Form.Item
                        label="Z"
                        name="estimated_camera_pose_tcp_z"
                        initialValue={-0.168}
                        tooltip="Estimated Z position of the camera in TCP frame in meters"
                    >
                        <InputNumber style={{ width: '100%' }} step={0.01}/>
                    </Form.Item>

                    <Form.Item
                        label="Rx"
                        name="estimated_camera_pose_tcp_rx"
                        initialValue={0}
                        tooltip="Estimated rotation around X axis of the camera in TCP frame in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Ry"
                        name="estimated_camera_pose_tcp_ry"
                        initialValue={0}
                        tooltip="Estimated rotation around Y axis of the camera in TCP frame in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Rz"
                        name="estimated_camera_pose_tcp_rz"
                        initialValue={-90.0}
                        tooltip="Estimated rotation around Z axis of the camera in TCP frame in degrees"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Divider>Calibration Parameters</Divider>

                    <Form.Item 
                        label="PnP Solver"
                        name="pnp_solver" 
                        initialValue={"Default"}
                        tooltip="Method of PnP solver used"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Default">Default</Option>
                            <Option value="Ransac">Ransac</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Hand Eye Calibration Method"
                        name="hand_eye_calibration_method" 
                        initialValue={"Tsai"}
                        tooltip="Method used for hand eye calibration"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Tsai">Tsai</Option>
                            <Option value="Park">Park</Option>
                            <Option value="Horaud">Horaud </Option>
                            <Option value="Andreff">Andreff</Option>
                            <Option value="Daniilidis">Daniilidis</Option>
                        </Select>
                    </Form.Item>

                    <Divider>Termination Criteria</Divider>
                
                    <Form.Item 
                        label="Type of Termination"
                        name="termination_type" 
                        initialValue={"Count + Epsilon"}
                        tooltip="Termination criteria for the calibration optimization"
                    >
                        <Select style={{width: '100%'}} >
                            <Option value="Count + Epsilon">Epsilon or Maximum Iterations</Option>
                            <Option value="Count">Maximum Iterations</Option>
                            <Option value="Epsilon">Epsilon</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Desired Accuracy" 
                        name="termination_epsilon" 
                        initialValue={0.001}
                        tooltip="Desired accuracy at which the iterative calibration algorithm stops"
                    >
                        <InputNumber style={{width: '100%'}} step={0.001}/>
                    </Form.Item>

                    <Form.Item 
                        label="Maximum Iterations" 
                        name="termination_maxcount" 
                        initialValue={30}
                        tooltip="Maximum number of iterations after which the iterative calibration algorithm stops"
                    >
                        <InputNumber style={{width: '100%'}} />
                    </Form.Item>

                </Form>
                <Flex gap="small" justify="right">
                    <Button 
                        size="small"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button 
                        size="small"
                        onClick={handleCalibrateClick}
                    >
                        Calibrate
                    </Button>
                    <Button type="primary"
                            size="small"
                            onClick={handleSaveCameraCalibrationClick} 
                    >
                        Save Calibration
                    </Button>
                </Flex>
            </Flex>) : (
                // 50vh is equal to 50% of the viewport's height, as 100% does not work.
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text style={{ color: '#888' }}>
                            Please add calibration by clicking <PlusOutlined style={{ fontSize: '1em' }} /> Add Calibration.
                        </Typography.Text>
                    }
                >
                </Empty>
                </div>
            )
}
        </div>
    )
}