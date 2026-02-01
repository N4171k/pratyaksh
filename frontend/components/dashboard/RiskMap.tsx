'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useServicesStore } from '@/lib/stores';
import { Service } from '@/lib/api-client';

interface RiskMapNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  sensitivity: number;
  breached: boolean;
  dataValue: number;
  logoUrl?: string;
}

interface RiskMapLink extends d3.SimulationLinkDatum<RiskMapNode> {
  source: RiskMapNode;
  target: RiskMapNode;
}

interface RiskMapProps {
  services: Service[];
  onServiceClick?: (service: Service) => void;
  width?: number;
  height?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: '#EF4444',      // Red - high risk
  Healthcare: '#F97316',   // Orange
  Government: '#F59E0B',   // Amber
  Dating: '#EC4899',       // Pink
  'E-commerce': '#8B5CF6', // Purple
  'Social Media': '#3B82F6', // Blue
  Professional: '#06B6D4', // Cyan
  Travel: '#10B981',       // Green
  Entertainment: '#6366F1', // Indigo
  News: '#64748B',         // Slate
  Education: '#14B8A6',    // Teal
  Gaming: '#A855F7',       // Violet
  Other: '#6B7280',        // Gray
};

export function RiskMap({ 
  services, 
  onServiceClick,
  width = 800,
  height = 600 
}: RiskMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    service: RiskMapNode | null;
  }>({ visible: false, x: 0, y: 0, service: null });

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || width,
          height: Math.max(400, clientHeight || height)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);

  // Build D3 visualization
  useEffect(() => {
    if (!svgRef.current || services.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width: w, height: h } = dimensions;

    // Create central "You" node
    const centerNode: RiskMapNode = {
      id: 'center',
      name: 'You',
      category: 'center',
      sensitivity: 0,
      breached: false,
      dataValue: 0,
    };

    // Create service nodes
    const nodes: RiskMapNode[] = [
      centerNode,
      ...services.map(s => ({
        id: s.domain,
        name: s.name || s.service_name,
        category: s.category,
        sensitivity: s.data_sensitivity,
        breached: (s.breach_status === 'breached') || (s.breach_count > 0),
        dataValue: s.estimated_data_value || s.data_sensitivity * 5,
        logoUrl: s.logo_url,
      }))
    ];

    // Create links from center to each service
    const links: RiskMapLink[] = services.map(s => ({
      source: centerNode,
      target: nodes.find(n => n.id === s.domain)!,
    }));

    // Define gradients for breach status
    const defs = svg.append('defs');
    
    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Breach pulse animation
    const pulseFilter = defs.append('filter')
      .attr('id', 'breach-pulse')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');
    
    pulseFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');

    // Create container group with zoom
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation<RiskMapNode>(nodes)
      .force('link', d3.forceLink<RiskMapNode, RiskMapLink>(links)
        .id(d => d.id)
        .distance(d => {
          const target = d.target as RiskMapNode;
          // Higher sensitivity = closer to center
          return 100 + (10 - target.sensitivity) * 15;
        })
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody<RiskMapNode>()
        .strength(d => d.id === 'center' ? -500 : -100)
      )
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide<RiskMapNode>()
        .radius(d => getNodeRadius(d) + 10)
      );

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => {
        const target = d.target as RiskMapNode;
        return target.breached ? '#EF4444' : '#374151';
      })
      .attr('stroke-opacity', d => {
        const target = d.target as RiskMapNode;
        return target.breached ? 0.8 : 0.3;
      })
      .attr('stroke-width', d => {
        const target = d.target as RiskMapNode;
        return target.breached ? 2 : 1;
      })
      .attr('stroke-dasharray', d => {
        const target = d.target as RiskMapNode;
        return target.breached ? '5,5' : 'none';
      });

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', d => d.id !== 'center' ? 'pointer' : 'default')
      .call(d3.drag<SVGGElement, RiskMapNode>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );

    // Node circles
    node.append('circle')
      .attr('r', d => getNodeRadius(d))
      .attr('fill', d => {
        if (d.id === 'center') return '#3B82F6';
        return CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Other;
      })
      .attr('stroke', d => d.breached ? '#EF4444' : 'rgba(255,255,255,0.2)')
      .attr('stroke-width', d => d.breached ? 3 : 1)
      .attr('filter', d => d.breached ? 'url(#breach-pulse)' : 'url(#glow)')
      .style('opacity', 0.9);

    // Breach indicator ring
    node.filter(d => d.breached)
      .append('circle')
      .attr('r', d => getNodeRadius(d) + 5)
      .attr('fill', 'none')
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('class', 'breach-ring');

    // Node logos/icons
    node.filter(d => d.id !== 'center' && !!d.logoUrl)
      .append('image')
      .attr('xlink:href', d => d.logoUrl || '')
      .attr('width', d => getNodeRadius(d))
      .attr('height', d => getNodeRadius(d))
      .attr('x', d => -getNodeRadius(d) / 2)
      .attr('y', d => -getNodeRadius(d) / 2)
      .attr('clip-path', 'circle()')
      .style('pointer-events', 'none');

    // Center node text
    node.filter(d => d.id === 'center')
      .append('text')
      .text('YOU')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Node labels
    node.filter(d => d.id !== 'center')
      .append('text')
      .text(d => d.name.length > 12 ? d.name.slice(0, 12) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', d => getNodeRadius(d) + 16)
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '11px')
      .style('pointer-events', 'none');

    // Interaction handlers
    node.on('mouseenter', (event, d) => {
      if (d.id === 'center') return;
      
      const [x, y] = d3.pointer(event, svg.node());
      setTooltip({
        visible: true,
        x: x + 10,
        y: y - 10,
        service: d
      });

      // Highlight connected link
      link.attr('stroke-opacity', l => 
        (l.target as RiskMapNode).id === d.id ? 1 : 0.1
      );
      
      // Dim other nodes
      node.style('opacity', n => 
        n.id === d.id || n.id === 'center' ? 1 : 0.3
      );
    });

    node.on('mouseleave', () => {
      setTooltip(prev => ({ ...prev, visible: false }));
      
      // Reset link opacity
      link.attr('stroke-opacity', l => {
        const target = l.target as RiskMapNode;
        return target.breached ? 0.8 : 0.3;
      });
      
      // Reset node opacity
      node.style('opacity', 1);
    });

    node.on('click', (event, d) => {
      if (d.id === 'center') return;
      
      const service = services.find(s => s.domain === d.id);
      if (service && onServiceClick) {
        onServiceClick(service);
      }
    });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as RiskMapNode).x!)
        .attr('y1', d => (d.source as RiskMapNode).y!)
        .attr('x2', d => (d.target as RiskMapNode).x!)
        .attr('y2', d => (d.target as RiskMapNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragStarted(event: d3.D3DragEvent<SVGGElement, RiskMapNode, RiskMapNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, RiskMapNode, RiskMapNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, RiskMapNode, RiskMapNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Animate breach rings
    const style = document.createElement('style');
    style.textContent = `
      @keyframes breach-rotate {
        from { stroke-dashoffset: 0; }
        to { stroke-dashoffset: 16; }
      }
      .breach-ring {
        animation: breach-rotate 1s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      simulation.stop();
      style.remove();
    };
  }, [services, dimensions, onServiceClick]);

  function getNodeRadius(node: RiskMapNode): number {
    if (node.id === 'center') return 35;
    // Size based on data value and sensitivity
    const base = 15;
    const sensitivityBonus = node.sensitivity * 1.5;
    const valueBonus = Math.min(15, node.dataValue / 5);
    return base + sensitivityBonus + valueBonus;
  }

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl"
      />
      
      {/* Tooltip */}
      {tooltip.visible && tooltip.service && (
        <div
          className="absolute pointer-events-none z-50 glass-card p-3 rounded-lg shadow-xl"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(0, -100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {tooltip.service.logoUrl && (
              <img 
                src={tooltip.service.logoUrl} 
                alt="" 
                className="w-6 h-6 rounded"
              />
            )}
            <span className="font-semibold text-white">
              {tooltip.service.name}
            </span>
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <p>Category: {tooltip.service.category}</p>
            <p>Sensitivity: {tooltip.service.sensitivity}/10</p>
            <p>Data Value: ${tooltip.service.dataValue.toFixed(2)}</p>
            {tooltip.service.breached && (
              <p className="text-red-400 font-semibold">⚠️ BREACHED</p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass-card p-3 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">Risk Level</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-300">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-300">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-300">High</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-red-500 border-dashed"></div>
          <span className="text-xs text-red-400">Breached</span>
        </div>
      </div>
    </div>
  );
}

export default RiskMap;
