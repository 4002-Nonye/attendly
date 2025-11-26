// ============================================
// BACKEND - Modern Professional PDF Generator
// lib/pdfReportGenerator.js
// ============================================

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateAttendancePDF(data, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100;

      // Add watermark if enabled
      if (options.watermark !== false) {
        addWatermark(doc);
      }

      // ============================================
      // HEADER SECTION WITH BETTER TEXT WRAPPING
      // ============================================
      let currentY = 50;

      // University Name - Centered, Bold, Large
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(
          data.universityName.toUpperCase() || 'MY UNIVERSITY',
          50,
          currentY,
          {
            align: 'center',
            width: pageWidth,
          }
        );

      // Report Title - Centered with proper wrapping
      currentY += 30; // Increased spacing
      
      // Truncate course title if too long
      const maxCourseTitleLength = 50;
      let courseTitle = data.courseTitle || '';
      if (courseTitle.length > maxCourseTitleLength) {
        courseTitle = courseTitle.substring(0, maxCourseTitleLength) + '...';
      }

      doc
        .fontSize(12) // Reduced font size for better fit
        .font('Helvetica-Bold')
        .text(
          `ATTENDANCE REPORT FOR ${data.courseCode}`,
          50,
          currentY,
          { align: 'center', width: pageWidth }
        );
      
      // Course Title on separate line if needed
      currentY += 20;
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(
          courseTitle.toUpperCase(),
          50,
          currentY,
          { align: 'center', width: pageWidth }
        );

      // Department - Centered with increased spacing
      if (data.department) {
        currentY += 25; // Increased spacing
        doc
          .fontSize(11) // Slightly smaller
          .font('Helvetica')
          .text(
            `DEPARTMENT OF ${data.department.toUpperCase()}`,
            50,
            currentY,
            {
              align: 'center',
              width: pageWidth,
            }
          );
      }

      // Academic Year and Semester - Centered
      currentY += 20;
      const semesterText = data.semester
        ? `${data.semester.toUpperCase()} SEMESTER`
        : '';
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`${data.academicYear}, ${semesterText}`, 50, currentY, {
          align: 'center',
          width: pageWidth,
        });

      // ============================================
      // SUMMARY STATISTICS - Vertical Layout
      // ============================================
      currentY += 30; // Increased spacing
      doc.fontSize(10).font('Helvetica-Bold');

      const stats = [
        { label: 'Total Sessions', value: data.totalSessions || 0 },
        { label: 'Total Students', value: data.summary.totalStudents },
        { label: 'Total Eligible Students', value: data.summary.eligibleCount },
        {
          label: 'Total Ineligible Students',
          value: data.summary.notEligibleCount,
        },
      ];

      stats.forEach((stat, index) => {
        doc.text(`${stat.label}: ${stat.value}`, 50, currentY);
        currentY += 18;
      });

      // ============================================
      //  TABLE SECTION - WITH COLUMN BORDERS
      // ============================================
      currentY += 20; // Increased spacing before table
      
      // Check if we have enough space for the table
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
        
        // Re-add watermark on new page
        if (options.watermark !== false) {
          addWatermark(doc);
        }
      }
      
      const tableTop = currentY;
      const rowHeight = 24;
      const tableLeft = 50;
      const tableRight = 550;

      // Define columns with precise positions and widths
      const columns = [
        { x: 50, width: 25, label: 'S/N', align: 'center', key: 'sn' },
        {
          x: 75,
          width: 70,
          label: 'Matric No',
          align: 'center',
          key: 'matricNo',
        },
        { x: 145, width: 110, label: 'Name', align: 'left', key: 'name' },
        {
          x: 255,
          width: 55,
          label: 'Enrolled',
          align: 'center',
          key: 'enrolledAt',
        },
        {
          x: 310,
          width: 50,
          label: 'Sessions',
          align: 'center',
          key: 'sessions',
        },
        {
          x: 360,
          width: 50,
          label: 'Attended',
          align: 'center',
          key: 'attended',
        },
        { x: 410, width: 45, label: 'Missed', align: 'center', key: 'missed' },
        { x: 455, width: 45, label: 'Rate', align: 'center', key: 'rate' },
        {
          x: 500,
          width: 50,
          label: 'Eligible',
          align: 'center',
          key: 'status',
        },
      ];

      // Function to capitalize names properly
      function capitalizeName(name) {
        if (!name) return '';
        return name
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      // Function to draw table with full borders
      function drawTableBorders(startY, endY) {
        // Draw outer border
        doc
          .rect(tableLeft, startY, tableRight - tableLeft, endY - startY)
          .stroke();

        // Draw vertical lines between columns
        columns.forEach((col, index) => {
          if (index > 0) {
            // Skip first column (left border)
            const lineX = col.x;
            doc.moveTo(lineX, startY).lineTo(lineX, endY).stroke();
          }
        });

        // Draw right border (last vertical line)
        doc.moveTo(tableRight, startY).lineTo(tableRight, endY).stroke();
      }

      // Function to draw table header
      function drawTableHeader(y) {
        const headerHeight = 25;

        // Draw header background
        doc
          .rect(tableLeft, y, tableRight - tableLeft, headerHeight)
          .fill('#f5f5f5');

        // Draw header borders
        drawTableBorders(y, y + headerHeight);

        // Draw header text with proper spacing
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000');

        columns.forEach((col) => {
          // Add padding to header text - especially for "Name" column
          let text = col.label;
          let xPosition = col.x;
          let textWidth = col.width;

          if (col.key === 'name') {
            // Add left padding for Name header
            xPosition = col.x + 3;
            textWidth = col.width - 6;
          }

          doc.text(text, xPosition, y + 8, {
            width: textWidth,
            align: col.align,
          });
        });

        return y + headerHeight;
      }

      // Draw initial header and get the starting Y for data
      let dataStartY = drawTableHeader(tableTop);
      let currentDataY = dataStartY;

      // Table data
      doc.font('Helvetica').fontSize(8);

      data.students.forEach((student, index) => {
        // Check if we need a new page
        if (currentDataY + rowHeight > 710) {
          // Draw borders for current page's data section
          drawTableBorders(dataStartY, currentDataY);

          doc.addPage();

          // Re-add watermark on new page
          if (options.watermark !== false) {
            addWatermark(doc);
          }

          currentDataY = 50;
          dataStartY = drawTableHeader(currentDataY);
          currentDataY = dataStartY;
          doc.font('Helvetica').fontSize(8);
        }

        // Zebra striping for rows
        if (index % 2 === 0) {
          doc
            .rect(tableLeft, currentDataY, tableRight - tableLeft, rowHeight)
            .fill('#fafafa');
        }

        doc.fillColor('#000000');

        // S/N - with padding
        doc.text((index + 1).toString(), columns[0].x, currentDataY + 8, {
          width: columns[0].width,
          align: columns[0].align,
        });

        // Matric No - with padding
        doc.text(
          (student.matricNo || '').toUpperCase(),
          columns[1].x,
          currentDataY + 8,
          {
            width: columns[1].width,
            align: columns[1].align,
          }
        );

        // Name - Capitalized and with proper padding
        const studentName = capitalizeName(student.fullName || student.name);
        doc.text(studentName, columns[2].x + 3, currentDataY + 8, {
          // Added 3px left padding
          width: columns[2].width - 6, // Reduced width to create padding
          align: columns[2].align,
          ellipsis: true,
        });

        // Enrolled At - with padding
        doc.text(
          `S${student.enrolledAtSession || 1}`,
          columns[3].x,
          currentDataY + 8,
          {
            width: columns[3].width,
            align: columns[3].align,
          }
        );

        // Sessions - with padding
        doc.text(
          student.totalSessions.toString(),
          columns[4].x,
          currentDataY + 8,
          {
            width: columns[4].width,
            align: columns[4].align,
          }
        );

        // Attended - with padding
        doc.text(
          student.totalAttended.toString(),
          columns[5].x,
          currentDataY + 8,
          {
            width: columns[5].width,
            align: columns[5].align,
          }
        );

        // Missed - with padding
        doc.text(
          student.totalAbsent.toString(),
          columns[6].x,
          currentDataY + 8,
          {
            width: columns[6].width,
            align: columns[6].align,
          }
        );

        // Rate (%) - with padding and color coding
        doc.font('Helvetica-Bold');
        const percentage = student.attendancePercentage;
        if (percentage >= 75) {
          doc.fillColor('#16a34a'); // Green
        } else if (percentage >= 50) {
          doc.fillColor('#f59e0b'); // Orange
        } else {
          doc.fillColor('#dc2626'); // Red
        }

        doc.text(`${percentage.toFixed(1)}%`, columns[7].x, currentDataY + 8, {
          width: columns[7].width,
          align: columns[7].align,
        });

        // Eligibility Status - with padding
        doc.font('Helvetica');
        if (student.eligible) {
          doc.fillColor('#16a34a').text('Yes', columns[8].x, currentDataY + 8, {
            width: columns[8].width,
            align: columns[8].align,
          });
        } else {
          doc.fillColor('#dc2626').text('No', columns[8].x, currentDataY + 8, {
            width: columns[8].width,
            align: columns[8].align,
          });
        }

        // Reset color for next row
        doc.fillColor('#000000');

        // Draw horizontal line between rows
        doc
          .moveTo(tableLeft, currentDataY + rowHeight)
          .lineTo(tableRight, currentDataY + rowHeight)
          .stroke();

        currentDataY += rowHeight;
      });

      // Draw final borders for the data section
      if (currentDataY > dataStartY) {
        drawTableBorders(dataStartY, currentDataY);
      }

      // ============================================
      // FOOTER SECTION
      // ============================================
      const footerY = Math.max(currentDataY + 20, doc.page.height - 110);

      // Draw footer separator line
      doc
        .moveTo(50, footerY - 10)
        .lineTo(550, footerY - 10)
        .lineWidth(0.5)
        .stroke();

      doc.fontSize(10).font('Helvetica').fillColor('#000000');

      // Prepared by line
      doc.text('Prepared by: _______________________', 50, footerY, {
        width: 240,
        align: 'left',
      });

      // Approved by line
      doc.text('Approved by: _______________________', 310, footerY, {
        width: 240,
        align: 'left',
      });

      // Generated date
      const generatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc.text(`Generated on: ${generatedDate}`, 50, footerY + 25, {
        align: 'left',
      });

      // Add confidential stamp if enabled
      if (options.confidential !== false) {
        doc
          .fontSize(8)
          .font('Helvetica-Bold')
          .fillColor('#dc2626')
          .text('CONFIDENTIAL - FOR OFFICIAL USE ONLY', 310, footerY + 25, {
            align: 'right',
            width: 240,
          });
      }

      // ============================================
      // POWERED BY - Bottom of page
      // ============================================
      const poweredByY = doc.page.height - 30;
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .fillColor('#666666')
        .text('Powered by Attendly', 50, poweredByY, {
          align: 'center',
          width: pageWidth,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to add watermark
function addWatermark(doc) {
  const watermarkText = 'CONFIDENTIAL';

  // Save current state
  doc.save();

  // Move to center and rotate
  doc
    .translate(doc.page.width / 2, doc.page.height / 2)
    .rotate(-45, { origin: [0, 0] })
    .fontSize(80)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .opacity(0.03)
    .text(watermarkText, -200, 0, {
      align: 'center',
      width: 400,
    });

  // Restore state
  doc.restore();
}

module.exports = { generateAttendancePDF };