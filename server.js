// server.js - Simple Node.js backend server for lead backup
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML/CSS/JS files

// Create leads directory if it doesn't exist
const leadsDir = path.join(__dirname, 'leads');
const leadsFile = path.join(leadsDir, 'leads.json');

async function ensureLeadsFile() {
    try {
        await fs.mkdir(leadsDir, { recursive: true });
        try {
            await fs.access(leadsFile);
        } catch {
            await fs.writeFile(leadsFile, '[]');
        }
    } catch (error) {
        console.error('Error creating leads file:', error);
    }
}

// Initialize leads file
ensureLeadsFile();

// API endpoint to save leads
app.post('/api/leads', async (req, res) => {
    try {
        const leadData = req.body;
        
        // Add timestamp and unique ID
        const lead = {
            id: Date.now().toString(),
            ...leadData,
            submittedAt: new Date().toISOString()
        };

        // Read existing leads
        const existingLeads = JSON.parse(await fs.readFile(leadsFile, 'utf8'));
        
        // Add new lead
        existingLeads.push(lead);
        
        // Save back to file
        await fs.writeFile(leadsFile, JSON.stringify(existingLeads, null, 2));
        
        // Also save to individual file for backup
        const individualFile = path.join(leadsDir, `lead_${lead.id}.json`);
        await fs.writeFile(individualFile, JSON.stringify(lead, null, 2));
        
        console.log('Lead saved:', lead);
        
        res.json({ success: true, message: 'Lead saved successfully', id: lead.id });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ success: false, message: 'Failed to save lead' });
    }
});

// API endpoint to get all leads (for admin)
app.get('/api/leads', async (req, res) => {
    try {
        const leads = JSON.parse(await fs.readFile(leadsFile, 'utf8'));
        res.json(leads);
    } catch (error) {
        console.error('Error reading leads:', error);
        res.status(500).json({ success: false, message: 'Failed to read leads' });
    }
});

// API endpoint to get leads count
app.get('/api/leads/count', async (req, res) => {
    try {
        const leads = JSON.parse(await fs.readFile(leadsFile, 'utf8'));
        res.json({ count: leads.length });
    } catch (error) {
        console.error('Error reading leads:', error);
        res.status(500).json({ success: false, message: 'Failed to read leads' });
    }
});

// Simple admin dashboard
app.get('/admin', async (req, res) => {
    try {
        const leads = JSON.parse(await fs.readFile(leadsFile, 'utf8'));
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Leads Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .stats { background: #f9f9f9; padding: 20px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Leads Dashboard</h1>
    <div class="stats">
        <h3>Total Leads: ${leads.length}</h3>
        <p>Last updated: ${new Date().toLocaleString()}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Source</th>
                <th>Submitted At</th>
            </tr>
        </thead>
        <tbody>
            ${leads.map(lead => `
                <tr>
                    <td>${lead.id}</td>
                    <td>${lead.firstName}</td>
                    <td>${lead.email}</td>
                    <td>${lead.mobile}</td>
                    <td>${lead.source}</td>
                    <td>${new Date(lead.submittedAt).toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading dashboard');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    process.exit(0);
});