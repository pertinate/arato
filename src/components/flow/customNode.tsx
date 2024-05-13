import { ChangeEventHandler, useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type NodeData = {
    value: number;
};

const handleStyle = { left: 0 };

const CustomNode = ({}: NodeProps<NodeData>) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(evt => {
        console.log(evt.target.value);
    }, []);

    return (
        <>
            <Handle type='target' position={Position.Top} />
            <Card>
                <CardHeader>
                    <CardTitle>Node</CardTitle>
                </CardHeader>
                <CardContent>
                    <label htmlFor='text'>Text:</label>
                    <input
                        id='text'
                        name='text'
                        onChange={onChange}
                        className='nodrag'
                    />
                </CardContent>
            </Card>
            <div></div>
            <Handle type='source' position={Position.Bottom} id='a' />
            <Handle
                type='source'
                position={Position.Bottom}
                id='b'
                style={handleStyle}
            />
        </>
    );
};

export default CustomNode;
