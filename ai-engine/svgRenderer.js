const NODE_WIDTH = 160;
const NODE_HEIGHT = 52;
const H_GAP = 60;   
const V_GAP = 80;  
const PADDING = 40;

const NODE_COLORS = {
  start:    { fill: "#1e3a5f", stroke: "#4a9eff", text: "#ffffff" },
  process:  { fill: "#1a1a2e", stroke: "#6c63ff", text: "#e0e0e0" },
  decision: { fill: "#2d1b4e", stroke: "#a855f7", text: "#e0e0e0" },
  end:      { fill: "#1a3a2a", stroke: "#22c55e", text: "#ffffff" },
};

/**
 * @param {object} workflow - validated output from optimizer.js
 * @returns {string} SVG markup string
 */
export function renderWorkflowSVG(workflow) {
  const { nodes, edges, title } = workflow;

  const COLS = 3;
  const positions = layoutNodes(nodes, COLS);

  const totalCols = Math.min(nodes.length, COLS);
  const totalRows = Math.ceil(nodes.length / COLS);

  const svgWidth = PADDING * 2 + totalCols * NODE_WIDTH + (totalCols - 1) * H_GAP;
  const svgHeight = PADDING * 2 + 30 + totalRows * NODE_HEIGHT + (totalRows - 1) * V_GAP + 20;

  const edgeSVG = edges.map((e) => renderEdge(e, positions)).join("\n");
  const nodeSVG = nodes.map((n) => renderNode(n, positions[n.id])).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" font-family="Inter, sans-serif">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#0d0d1a" rx="12"/>

  <!-- Title -->
  <text x="${svgWidth / 2}" y="28" text-anchor="middle" fill="#a0a0c0" font-size="13" font-weight="600">${escapeXml(title)}</text>

  <!-- Edges (drawn under nodes) -->
  <g id="edges">${edgeSVG}</g>

  <!-- Nodes -->
  <g id="nodes">${nodeSVG}</g>
</svg>`;
}

function layoutNodes(nodes, cols) {
  const positions = {};
  nodes.forEach((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions[node.id] = {
      x: PADDING + col * (NODE_WIDTH + H_GAP),
      y: PADDING + 40 + row * (NODE_HEIGHT + V_GAP),
    };
  });
  return positions;
}

function renderNode(node, pos) {
  if (!pos) return "";
  const { x, y } = pos;
  const colors = NODE_COLORS[node.type] || NODE_COLORS.process;
  const cx = x + NODE_WIDTH / 2;

  const shape =
    node.type === "decision"
      ? renderDiamond(x, y, colors)
      : `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" rx="8"
           fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5"/>`;

  return `<g class="node" id="${node.id}">
    ${shape}
    <text x="${cx}" y="${y + NODE_HEIGHT / 2 - 6}" text-anchor="middle" fill="${colors.text}" font-size="11" font-weight="600">${escapeXml(node.label)}</text>
    <text x="${cx}" y="${y + NODE_HEIGHT / 2 + 10}" text-anchor="middle" fill="#888" font-size="9">${escapeXml(node.owner)} · ${escapeXml(node.eta)}</text>
  </g>`;
}

function renderDiamond(x, y, colors) {
  const cx = x + NODE_WIDTH / 2;
  const cy = y + NODE_HEIGHT / 2;
  const w = NODE_WIDTH / 2 - 4;
  const h = NODE_HEIGHT / 2 - 4;
  const points = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
  return `<polygon points="${points}" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5"/>`;
}

function renderEdge(edge, positions) {
  const from = positions[edge.from];
  const to = positions[edge.to];
  if (!from || !to) return "";

  const x1 = from.x + NODE_WIDTH / 2;
  const y1 = from.y + NODE_HEIGHT;
  const x2 = to.x + NODE_WIDTH / 2;
  const y2 = to.y;
  const midY = (y1 + y2) / 2;

  const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  const labelX = (x1 + x2) / 2;
  const labelY = midY;

  return `<g class="edge">
    <defs><marker id="arrow-${edge.from}-${edge.to}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker></defs>
    <path d="${path}" fill="none" stroke="#444" stroke-width="1.5" marker-end="url(#arrow-${edge.from}-${edge.to})"/>
    ${edge.label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#666" font-size="9">${escapeXml(edge.label)}</text>` : ""}
  </g>`;
}

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}