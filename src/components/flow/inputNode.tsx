import { ReactNode } from 'react';
import RenderNode from './render';
import { NodeProps } from 'reactflow';

type NodeData = {
    children: ReactNode;
};

const InputNode = (nodeProps: NodeProps<NodeData>) => {
    return (
        <RenderNode
            {...nodeProps}
            data={{
                ...nodeProps.data,
                target: false,
                source: true,
            }}
        />
    );
};

export default InputNode;
