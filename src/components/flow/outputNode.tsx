import { ReactNode } from 'react';
import RenderNode from './render';
import { NodeProps } from 'reactflow';

type NodeData = {
    children: ReactNode;
};

const OutputNode = (nodeProps: NodeProps<NodeData>) => {
    return (
        <RenderNode
            {...nodeProps}
            data={{
                ...nodeProps.data,
                target: true,
                source: false,
            }}
        />
    );
};

export default OutputNode;
