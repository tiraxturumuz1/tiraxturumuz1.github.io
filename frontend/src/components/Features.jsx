.features-container {
    padding: 60px 5%;
    background-color: #ffffff;
    text-align: center;
}

.features-title {
    font-size: 32px;
    color: #111827;
    margin-bottom: 40px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.feature-card {
    padding: 30px;
    border-radius: 15px;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    border-color: #2563eb;
}

.feature-icon {
    font-size: 40px;
    margin-bottom: 20px;
    display: block;
}

.feature-card h3 {
    font-size: 20px;
    color: #1f2937;
    margin-bottom: 15px;
}

.feature-card p {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
}
