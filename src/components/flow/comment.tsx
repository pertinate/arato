import { type ReactNode } from 'react';
import RenderNode from './render';
import { type NodeProps, getRectOfNodes, useStore } from 'reactflow';
import { cn } from '~/lib/utils';

type NodeData = {
    children: ReactNode;
};

const Comment = (nodeProps: NodeProps<NodeData>) => {
    const nodeRect = useStore(state => {
        const childNodes = Array.from(state.nodeInternals.values()).filter(
            entry => entry.parentId == nodeProps.id
        );
        const rect = getRectOfNodes(childNodes);
        return rect;
    });

    return (
        <RenderNode
            {...nodeProps}
            data={{
                ...nodeProps.data,
                target: true,
                source: false,
                cardClassName: cn(),
                children: (
                    <div
                        style={{
                            width: nodeRect.width,
                            height: nodeRect.height,
                        }}
                    />
                ),
            }}
        ></RenderNode>
    );
};

export default Comment;
