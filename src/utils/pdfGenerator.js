import jsPDF from 'jspdf';

// Enhanced PDF generation function with professional formatting
export const generateProfessionalPDF = (formData, generatedTrip) => {
    const doc = new jsPDF();
    const { mockData, tripDays, budgetEstimate, travelers } = generatedTrip;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Color scheme
    const primaryColor = [102, 126, 234]; // #667eea
    const secondaryColor = [118, 75, 162]; // #764ba2
    const darkGray = [31, 41, 55];
    const lightGray = [156, 163, 175];
    const bgGray = [249, 250, 251];

    // Helper functions
    const checkPageBreak = (neededSpace = 30) => {
        if (yPos + neededSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

    const drawBox = (x, y, width, height, fillColor, borderColor = null) => {
        if (fillColor) {
            doc.setFillColor(...fillColor);
            doc.rect(x, y, width, height, 'F');
        }
        if (borderColor) {
            doc.setDrawColor(...borderColor);
            doc.setLineWidth(0.5);
            doc.rect(x, y, width, height, 'S');
        }
    };

    const drawGradientBox = (x, y, width, height) => {
        // Simulate gradient with multiple rectangles
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            const ratio = i / steps;
            const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * ratio;
            const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * ratio;
            const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * ratio;
            doc.setFillColor(r, g, b);
            doc.rect(x + (width / steps) * i, y, width / steps, height, 'F');
        }
    };

    // ===== COVER PAGE =====
    // Gradient header
    drawGradientBox(0, 0, pageWidth, 80);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('WanderAI', pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('Your AI-Generated Trip Itinerary', pageWidth / 2, 50, { align: 'center' });

    yPos = 100;

    // Destination box
    drawBox(margin, yPos, contentWidth, 40, bgGray, lightGray);
    doc.setTextColor(...darkGray);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(formData.destination, pageWidth / 2, yPos + 25, { align: 'center' });
    yPos += 55;

    // Trip info grid
    const boxWidth = (contentWidth - 10) / 2;
    const boxHeight = 30;

    // Duration box
    drawBox(margin, yPos, boxWidth, boxHeight, [240, 253, 244], [16, 185, 129]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('DURATION', margin + 10, yPos + 12);
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(`${tripDays} Days`, margin + 10, yPos + 22);

    // Travelers box
    drawBox(margin + boxWidth + 10, yPos, boxWidth, boxHeight, [240, 253, 244], [16, 185, 129]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('TRAVELERS', margin + boxWidth + 20, yPos + 12);
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(`${travelers} ${travelers === 1 ? 'Person' : 'People'}`, margin + boxWidth + 20, yPos + 22);
    yPos += boxHeight + 10;

    // Dates box
    drawBox(margin, yPos, boxWidth, boxHeight, [254, 243, 199], [245, 158, 11]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('START DATE', margin + 10, yPos + 12);
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'normal');
    doc.text(new Date(formData.startDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    }), margin + 10, yPos + 22);

    // End date box
    drawBox(margin + boxWidth + 10, yPos, boxWidth, boxHeight, [254, 243, 199], [245, 158, 11]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('END DATE', margin + boxWidth + 20, yPos + 12);
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text(new Date(formData.endDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    }), margin + boxWidth + 20, yPos + 22);
    yPos += boxHeight + 10;

    // Distance box
    drawBox(margin, yPos, boxWidth, boxHeight, [239, 246, 255], [59, 130, 246]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('TOTAL DISTANCE', margin + 10, yPos + 12);
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(`${mockData.totalKm} km`, margin + 10, yPos + 22);

    // Travel type box
    drawBox(margin + boxWidth + 10, yPos, boxWidth, boxHeight, [239, 246, 255], [59, 130, 246]);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('TRAVEL TYPE', margin + boxWidth + 20, yPos + 12);
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(formData.travelType.charAt(0).toUpperCase() + formData.travelType.slice(1), margin + boxWidth + 20, yPos + 22);
    yPos += boxHeight + 15;

    // Budget section
    drawBox(margin, yPos, contentWidth, 45, [252, 231, 243], [236, 72, 153]);
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text('ESTIMATED BUDGET', margin + 10, yPos + 15);
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text(`₹${budgetEstimate.min.toLocaleString()} - ₹${budgetEstimate.max.toLocaleString()}`, margin + 10, yPos + 28);
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.setFont(undefined, 'normal');
    doc.text(`Per Day: ₹${budgetEstimate.perDay.min.toLocaleString()} - ₹${budgetEstimate.perDay.max.toLocaleString()}`, margin + 10, yPos + 38);

    // ===== NEW PAGE - HIGHLIGHTS =====
    doc.addPage();
    yPos = margin;

    // Section header
    drawGradientBox(margin, yPos, contentWidth, 15);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TRIP HIGHLIGHTS', margin + 5, yPos + 10);
    yPos += 25;

    // Highlights
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'normal');
    mockData.highlights.forEach((highlight, index) => {
        doc.setFillColor(...primaryColor);
        doc.circle(margin + 5, yPos - 2, 2, 'F');
        doc.text(highlight, margin + 12, yPos);
        yPos += 8;
    });
    yPos += 10;

    // Best time to visit
    drawBox(margin, yPos, contentWidth, 15, [254, 249, 195], [234, 179, 8]);
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(`Best Time to Visit: ${mockData.bestTime}`, margin + 5, yPos + 10);
    yPos += 25;

    // ===== DAY-WISE ITINERARY =====
    mockData.dayPlans.slice(0, tripDays).forEach((day, dayIndex) => {
        checkPageBreak(50);

        // Day header
        drawGradientBox(margin, yPos, contentWidth, 12);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        doc.text(`DAY ${day.day}: ${day.title.toUpperCase()}`, margin + 5, yPos + 8);
        yPos += 20;

        day.activities.forEach((activity, actIndex) => {
            checkPageBreak(35);

            // Activity box
            drawBox(margin, yPos, contentWidth, 30, bgGray, lightGray);

            // Time badge
            drawBox(margin + 5, yPos + 5, 35, 10, primaryColor);
            doc.setFontSize(9);
            doc.setTextColor(255, 255, 255);
            doc.setFont(undefined, 'bold');
            doc.text(activity.time, margin + 22.5, yPos + 11.5, { align: 'center' });

            // Duration badge
            doc.setFontSize(8);
            doc.setTextColor(...lightGray);
            doc.setFont(undefined, 'normal');
            doc.text(activity.duration, margin + 45, yPos + 11);

            // Place name
            doc.setFontSize(11);
            doc.setTextColor(...darkGray);
            doc.setFont(undefined, 'bold');
            doc.text(activity.place, margin + 5, yPos + 21);

            // Description
            doc.setFontSize(9);
            doc.setTextColor(...lightGray);
            doc.setFont(undefined, 'normal');
            const descLines = doc.splitTextToSize(activity.description, contentWidth - 10);
            doc.text(descLines[0], margin + 5, yPos + 27);

            yPos += 35;
        });

        yPos += 5;
    });

    // ===== HOTELS =====
    checkPageBreak(50);

    // Section header
    drawGradientBox(margin, yPos, contentWidth, 15);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RECOMMENDED HOTELS', margin + 5, yPos + 10);
    yPos += 25;

    mockData.hotels.forEach((hotel, index) => {
        checkPageBreak(35);

        // Hotel box
        drawBox(margin, yPos, contentWidth, 28, bgGray, lightGray);

        // Hotel name
        doc.setFontSize(12);
        doc.setTextColor(...darkGray);
        doc.setFont(undefined, 'bold');
        doc.text(hotel.name, margin + 5, yPos + 10);

        // Type badge
        const typeWidth = 25;
        drawBox(margin + 5, yPos + 13, typeWidth, 6, [229, 231, 235]);
        doc.setFontSize(7);
        doc.setTextColor(...lightGray);
        doc.setFont(undefined, 'normal');
        doc.text(hotel.type, margin + 5 + typeWidth / 2, yPos + 17, { align: 'center' });

        // Rating
        doc.setFontSize(9);
        doc.setTextColor(245, 158, 11);
        doc.setFont(undefined, 'bold');
        doc.text(`★ ${hotel.rating}`, margin + 35, yPos + 17);

        // Location
        doc.setFontSize(9);
        doc.setTextColor(...lightGray);
        doc.setFont(undefined, 'normal');
        doc.text(`📍 ${hotel.location}`, margin + 5, yPos + 23);

        // Price
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text(hotel.price, pageWidth - margin - 5, yPos + 23, { align: 'right' });

        yPos += 33;
    });

    // ===== TRANSPORT =====
    checkPageBreak(50);

    // Section header
    drawGradientBox(margin, yPos, contentWidth, 15);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('LOCAL TRANSPORT OPTIONS', margin + 5, yPos + 10);
    yPos += 25;

    mockData.transport.forEach((transport, index) => {
        checkPageBreak(25);

        // Transport box
        drawBox(margin, yPos, contentWidth, 20, bgGray, lightGray);

        // Mode
        doc.setFontSize(11);
        doc.setTextColor(...darkGray);
        doc.setFont(undefined, 'bold');
        doc.text(transport.mode, margin + 5, yPos + 10);

        // Cost
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text(transport.cost, pageWidth - margin - 5, yPos + 10, { align: 'right' });

        // Description
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.setFont(undefined, 'normal');
        const transportDesc = doc.splitTextToSize(transport.description, contentWidth - 10);
        doc.text(transportDesc[0], margin + 5, yPos + 16);

        yPos += 25;
    });

    // ===== FOOTER ON ALL PAGES =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(...lightGray);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.setFont(undefined, 'normal');
        doc.text('Generated by WanderAI - Your AI Travel Companion', margin, pageHeight - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    // Save PDF
    const fileName = `WanderAI-${formData.destination.replace(/,/g, '').replace(/ /g, '-')}-Itinerary.pdf`;
    doc.save(fileName);
};
