document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. TIMELINE INITIALIZATION
    // ==========================================
    const timelineContainer = document.getElementById('timeline-container');
    
    // Abstract base dates to make timeline evenly spaced
    const today = new Date();
    const MBO_DATE = new Date(today);
    MBO_DATE.setDate(today.getDate() + 28); // "MBO Strike" is exactly 4 weeks out from today logic
    
    function getWeekDate(offsetWeeks) {
        const d = new Date(MBO_DATE);
        d.setDate(d.getDate() - (offsetWeeks * 7));
        return d;
    }

    const timelineItems = new vis.DataSet([
        { id: 't1', content: 'Week -6<br><small>Normal Stock (-1.9% WoW)</small>', start: getWeekDate(6) },
        { id: 't2', content: 'Week -5<br><small>Base Volume Est.</small>', start: getWeekDate(5) },
        { id: 't3', content: 'Week -4: THE SIGNAL<br><strong>🚨 116.3% Volume Spike</strong>', start: getWeekDate(4), className: 'red-alert' },
        { id: 't4', content: 'Week -3<br><small>Sustained Sales (+29%)</small>', start: getWeekDate(3) },
        { id: 't5', content: 'Week -2<br><small>Bleeding Stock (+7.8%)</small>', start: getWeekDate(2) },
        { id: 't6', content: 'Week -1<br><small>Critical Depletion (+12.3%)</small>', start: getWeekDate(1) },
        { id: 't7', content: 'Week 0: MBO STRIKES<br><strong>Competitor Supply Fails</strong>', start: MBO_DATE, className: 'red-alert' },
        { id: 't8', content: 'ACTION: Substitute<br><strong>Capture $2.6B</strong>', start: getWeekDate(3.5), className: 'green-action' }
    ]);

    const timelineOptions = {
        height: '140px',
        start: getWeekDate(7),
        end: getWeekDate(-1),
        zoomable: false,
        selectable: true,
        type: 'box',
        format: {
            minorLabels: {
                day: 'MMM D',
                week: 'MMM D'
            }
        }
    };

    const timeline = new vis.Timeline(timelineContainer, timelineItems, timelineOptions);

    // ==========================================
    // 2. MINDMAP INITIALIZATION (Hierarchical Flow)
    // ==========================================
    // Utilizing descriptive text embeddings cleanly integrated into standard UI forms
    const nodes = new vis.DataSet([
        // Level 1: Triggers
        { id: 1, label: "Macro Event\nWinter Resp Surge", level: 0, shape: 'box', color: {background: '#374151', border: '#1F2937'} },
        { id: 2, label: "Macro Event\nHurricane Plastics", level: 0, shape: 'box', color: {background: '#374151', border: '#1F2937'} },
        
        // Level 2: Indicator
        { id: 3, label: "Customer Hoarding Alert\n4-Week Lead Indicator", title: "+116% Volume Spike", level: 1, shape: 'image', image: './Warning.png', size: 35, font: {bold: true, size: 14, color: '#111827'} },
        
        // Level 3: Segments
        { id: 4, label: "Highest Risk Segment\nFeeding Tubes", title: "Variance: +4536%", level: 2, shape: 'box', color: {background: '#EF4444', border: '#B91C1C'} },
        { id: 5, label: "Highest Risk Segment\nEndotracheal Tubes", title: "Variance: +1741%", level: 2, shape: 'box', color: {background: '#EF4444', border: '#B91C1C'} },
        
        // Level 4: Engine
        { id: 6, label: "MEDLINE MBO\nPREDICTION ENGINE", level: 3, shape: 'image', image: './Center.png', size: 45, font: {bold: true, size: 16, color: '#111827'} },
        
        // Level 5: Response
        { id: 7, label: "Strategic Action\nProactive Substitution", level: 4, shape: 'box', color: {background: '#059669', border: '#047857'} },
        
        // Level 6: Revenue
        { id: 8, label: "Financial Impact\n$2.62B Captured", level: 5, shape: 'image', image: './Revenue.png', size: 35, font: {bold: true, size: 14, color: '#111827'} }
    ]);

    const edges = new vis.DataSet([
        { from: 1, to: 3, arrows: 'to', color: '#6B7280' },
        { from: 2, to: 3, arrows: 'to', color: '#6B7280' },
        
        { from: 3, to: 4, arrows: 'to', color: '#EF4444', width: 2 },
        { from: 3, to: 5, arrows: 'to', color: '#EF4444', width: 2 },
        
        { from: 4, to: 6, arrows: 'to', color: '#6B7280' },
        { from: 5, to: 6, arrows: 'to', color: '#6B7280' },
        
        { from: 6, to: 7, arrows: 'to', color: '#10B981', width: 2 },
        { from: 7, to: 8, arrows: 'to', color: '#10B981', width: 2 }
    ]);

    const mindmapContainer = document.getElementById('mindmap-container');
    const mindmapData = { nodes: nodes, edges: edges };
    const mindmapOptions = {
        layout: {
            hierarchical: {
                direction: 'LR',  // Left to Right flowchart
                levelSeparation: 190,
                nodeSpacing: 100,
                treeSpacing: 150
            }
        },
        nodes: {
            font: { color: '#ffffff', face: 'Inter', multi: 'html', align: 'center' },
            margin: { top: 12, right: 15, bottom: 12, left: 15 },
            borderWidth: 0,
            shapeProperties: { useBorderWithImage: false }
        },
        edges: {
            smooth: { type: 'cubicBezier' }
        },
        interaction: { hover: true, zoomView: true }
    };

    const network = new vis.Network(mindmapContainer, mindmapData, mindmapOptions);

    // ==========================================
    // 3. INTERACTIVE DATA PANEL
    // ==========================================
    const panelHeader = document.getElementById('panel-header');
    const panelContent = document.getElementById('panel-content');

    const contentDatabase = {
        't3': { // Timeline Week -4
            title: "Week -4: The Hoarding Trigger",
            desc: "Customers begin aggressive stockpiling precisely 28 days before the competitor backorder takes effect.",
            html: `
                <div class="data-card alert">
                    <h3>Sales Volume Spike</h3>
                    <div class="value">+116.30%</div>
                    <p>Average weekly sales surge compared to historical baselines.</p>
                </div>
                <div class="data-card">
                    <h3>Hoarding Behavior</h3>
                    <div class="value">+23.04%</div>
                    <p>Increase in individual order sizes. Existing customers are driving the volume, not new buyers.</p>
                </div>
            `
        },
        't7': { // MBO Strikes
            title: "Week 0: Backorder Realized",
            desc: "The competitor officially runs out of inventory.",
            html: `
                <div class="data-card alert">
                    <h3>Market Vulnerability</h3>
                    <div class="value">0 Stock</div>
                    <p>Competitor supply chain fails, forcing hospitals to seek immediate alternatives.</p>
                </div>
            `
        },
        't8': { // Timeline Action
            title: "Proactive Marketing Window",
            desc: "The critical window for Medline sales teams to reach out.",
            html: `
                <div class="data-card success">
                    <h3>Action Required</h3>
                    <div class="value">Switch SKUs</div>
                    <p>Contact buyers triggering the Week -4 spike and offer the Medline substitute alternative immediately.</p>
                </div>
            `
        },
        3: { // Mindmap Early Warning
            title: "4-Week Lead Indicator",
            desc: "The statistical threshold that triggers a Medline sales alert.",
            html: `
                <div class="data-card alert">
                    <h3>Predictive Spike</h3>
                    <div class="value">116.3% Vol</div>
                    <p>Accompanied by a rapidly accelerating stock burn rate (+12% WoW).</p>
                </div>
                <table>
                    <thead>
                        <tr><th>Weeks Prior</th><th>Panic Buy Vol.</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>6 Weeks</td><td>+21.12%</td></tr>
                        <tr><td>5 Weeks</td><td>+25.83%</td></tr>
                        <tr style="background:#FEF2F2"><td><strong>4 Weeks</strong></td><td><strong>+116.30%</strong></td></tr>
                        <tr><td>3 Weeks</td><td>+29.48%</td></tr>
                    </tbody>
                </table>
            `
        },
        4: { // Feeding Tubes
            title: "Highest Risk: Feeding Tubes",
            desc: "Gastric Sump Tubes and Nutritionals exhibit the most extreme hoarding.",
            html: `
                <div class="data-card alert">
                    <h3>Variance Spike</h3>
                    <div class="value">+4,536%</div>
                    <p>Volume jumped from 99 units to 4,579 units in week -4.</p>
                </div>
            `
        },
        5: { // Endo Tubes
            title: "Highest Risk: Endotracheal",
            desc: "Anesthesia Systems exhibit massive hoarding leading into respiratory surges.",
            html: `
                <div class="data-card alert">
                    <h3>Variance Spike</h3>
                    <div class="value">+1,741%</div>
                    <p>Volume jumped from 5,370 units to 98,888 units in week -4.</p>
                </div>
            `
        },
        8: { // Revenue
            title: "Revenue Capture Scenarios",
            desc: "Converting the competitor supply failure into Medline top-line growth.",
            html: `
                <div class="data-card success">
                    <h3>Moderate Capture (25%)</h3>
                    <div class="value">$2.62 Billion</div>
                    <p>Projected revenue if 25% of the substitutable addressable market is transitioned during the 4-week window.</p>
                </div>
                <table>
                    <thead>
                        <tr><th>Scenario</th><th>Captured Value</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Conservative (10%)</td><td>$1.05 Billion</td></tr>
                        <tr style="background:#F0FDF4; font-weight:600;"><td>Moderate (25%)</td><td>$2.62 Billion</td></tr>
                        <tr><td>Aggressive (50%)</td><td>$5.25 Billion</td></tr>
                    </tbody>
                </table>
            `
        }
    };

    function updatePanel(id) {
        if (contentDatabase[id]) {
            const info = contentDatabase[id];
            panelHeader.innerHTML = `<h2>${info.title}</h2><p>${info.desc}</p>`;
            panelContent.innerHTML = info.html;
        } else {
            panelHeader.innerHTML = `<h2>Data Node Selected</h2><p>Overview perspective.</p>`;
            panelContent.innerHTML = `<div class="empty-state"><p>Detailed metrics not available for this aggregate node. Click on an alert or revenue metric.</p></div>`;
        }
    }

    // Bind Timeline Clicks
    timeline.on('select', function (properties) {
        if (properties.items.length > 0) {
            updatePanel(properties.items[0]);
            network.unselectAll(); // visual sync
        }
    });

    // Bind Mindmap Clicks
    network.on("click", function (params) {
        if (params.nodes.length > 0) {
            updatePanel(params.nodes[0]);
            timeline.setSelection([]); // visual sync
        } else {
            // Background click resetting
            panelHeader.innerHTML = `<h2>Select an Element</h2><p>Click any timeline event or process node to view the underlying data statistics.</p>`;
            panelContent.innerHTML = `<div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <p>No element selected</p>
            </div>`;
        }
    });
});
