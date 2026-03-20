import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { FLOW_NODES, FLOW_EDGES } from '../data';

const nodeTypes = {
  custom: CustomNode,
};

export default function FlowGraph({ onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(FLOW_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(FLOW_EDGES);

  const handleNodeClick = useCallback(
    (event, node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
        >
            <Background gap={20} size={1} color="#E5E7EB" />
            <Controls className="!bg-white !border-gray-200 !shadow-md fill-gray-600" />
        </ReactFlow>
    </div>
  );
}
