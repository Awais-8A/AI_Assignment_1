let graph = {};
let network;

function initializeGraph() {
    const nodes = [];
    const edges = [];

    for (let node in graph) {
        nodes.push({
            id: node,
            label: node,
            color: '#4CAF50', 
            font: { color: 'white', size: 18 }
        });
        graph[node].forEach(([neighbor, cost]) => {
            edges.push({
                from: node,
                to: neighbor,
                label: cost.toString(),
                color: { inherit: 'from' }, 
            });
        });
    }

    const container = document.getElementById('graph');
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = {
        nodes: { shape: 'circle', size: 30 },
        edges: { arrows: 'to', font: { align: 'top' } },
        physics: false,
    };

    network = new vis.Network(container, data, options);
}

function resetNodeColors() {
    const nodes = network.body.data.nodes.get();
    const updatedNodes = nodes.map(node => ({
        id: node.id,
        color: '#4CAF50', 
    }));
    network.body.data.nodes.update(updatedNodes);
}

function highlightPath(path) {
    const updatedNodes = path.map(node => ({
        id: node,
        color: 'red', 
    }));
    network.body.data.nodes.update(updatedNodes);
}

function addEdge() {
    const fromNode = document.getElementById('from-node').value.trim();
    const toNode = document.getElementById('to-node').value.trim();
    const cost = parseInt(document.getElementById('cost').value.trim());

    if (fromNode && toNode && cost) {
        if (!graph[fromNode]) graph[fromNode] = [];
        graph[fromNode].push([toNode, cost]);

        if (!graph[toNode]) graph[toNode] = [];
        initializeGraph();
        alert(`Edge added: ${fromNode} -> ${toNode} (Cost: ${cost})`);
    } else {
        alert('Please fill in all fields correctly.');
    }
}


function runBFS() {
    const start = prompt("Enter the start node:");
    const goal = prompt("Enter the goal node:");
    if (!graph[start] || !graph[goal]) {
        alert("Invalid start or goal node.");
        return;
    }

    resetNodeColors(); 

    let steps = 0;
    const visited = new Set();
    const queue = [[start, [start]]];

    while (queue.length > 0) {
        steps++; 
        const [node, path] = queue.shift();
        if (node === goal) {
            highlightPath(path); 
            document.getElementById('result').textContent = `Path found: ${path.join(' -> ')} (Steps taken: ${steps})`;
            return;
        }
        if (!visited.has(node)) {
            visited.add(node);
            (graph[node] || []).forEach(([neighbor]) => {
                if (!visited.has(neighbor)) {
                    queue.push([neighbor, [...path, neighbor]]);
                }
            });
        }
    }
    document.getElementById('result').textContent = `Path not found (Steps taken: ${steps})`;
}

function runDFS() {
    const start = prompt("Enter the start node:");
    const goal = prompt("Enter the goal node:");
    if (!graph[start] || !graph[goal]) {
        alert("Invalid start or goal node.");
        return;
    }

    resetNodeColors(); 

    let steps = 0; 
    const visited = new Set();

    function dfs(node, path) {
        steps++; 
        if (node === goal) {
            highlightPath(path); 
            document.getElementById('result').textContent = `Path found: ${path.join(' -> ')} (Steps taken: ${steps})`;
            return true;
        }
        visited.add(node);
        for (let [neighbor] of graph[node] || []) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor, [...path, neighbor])) return true;
            }
        }
        return false;
    }

    if (!dfs(start, [start])) {
        document.getElementById('result').textContent = `Path not found (Steps taken: ${steps})`;
    }
}

function runUCS() {
    const start = prompt("Enter the start node:");
    const goal = prompt("Enter the goal node:");
    if (!graph[start] || !graph[goal]) {
        alert("Invalid start or goal node.");
        return;
    }

    resetNodeColors(); 

    let steps = 0; 
    const pq = [[0, start, []]]; 
    const visited = new Set();

    function updatePriorityQueueDisplay() {
        const queueList = document.getElementById('queue-list');
        queueList.innerHTML = "";
        pq.forEach(([cost, node, path]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Node: ${node}, Cost: ${cost}, Path: ${path.concat(node).join(' -> ')}`;
            queueList.appendChild(listItem);
        });
    }

    while (pq.length > 0) {
        steps++; 
        pq.sort((a, b) => a[0] - b[0]);
        updatePriorityQueueDisplay();
        const [cost, node, path] = pq.shift(); 

        if (node === goal) {
            highlightPath(path.concat(node)); 
            document.getElementById('result').textContent = `Path found: ${path.concat(node).join(' -> ')} (Cost: ${cost}, Steps taken: ${steps})`;
            return;
        }

        if (!visited.has(node)) {
            visited.add(node);
            (graph[node] || []).forEach(([neighbor, edgeCost]) => {
                if (!visited.has(neighbor)) {
                    pq.push([cost + edgeCost, neighbor, path.concat(node)]);
                }
            });
        }
    }

    document.getElementById('result').textContent = `Path not found (Steps taken: ${steps})`;
}

initializeGraph(); 