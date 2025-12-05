const PDFDocument = require('pdfkit');

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

      // HEADER SECTION
      let currentY = 50;

      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(
          data.universityName?.toUpperCase() || 'MY UNIVERSITY',
          50,
          currentY,
          { align: 'center', width: pageWidth }
        );

      currentY += 30;

      const maxCourseTitleLength = 50;
      let courseTitle = data.courseTitle || '';
      if (courseTitle.length > maxCourseTitleLength) {
        courseTitle = courseTitle.substring(0, maxCourseTitleLength) + '...';
      }

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`ATTENDANCE REPORT FOR ${data.courseCode}`, 50, currentY, {
          align: 'center',
          width: pageWidth,
        });

      currentY += 20;

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(courseTitle.toUpperCase(), 50, currentY, {
          align: 'center',
          width: pageWidth,
        });

      if (data.department) {
        currentY += 25;
        doc
          .fontSize(11)
          .font('Helvetica')
          .text(
            `DEPARTMENT OF ${data.department.toUpperCase()}`,
            50,
            currentY,
            { align: 'center', width: pageWidth }
          );
      }

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

      // SUMMARY SECTION
      currentY += 30;
      doc.fontSize(10).font('Helvetica-Bold');

      const stats = [
        { label: 'Total Sessions', value: data.totalSessions || 0 },
        { label: 'Total Students', value: data.summary.totalStudents },
        { label: 'Total Eligible Students', value: data.summary.eligibleCount },
        {
          label: 'Total Ineligible Students',
          value: data.summary.notEligibleCount,
        },

        {
          label: 'Attendance Threshold',
          value: `${data.threshold}%`,
        },
      ];

      stats.forEach((stat) => {
        doc.text(`${stat.label}: ${stat.value}`, 50, currentY);
        currentY += 18;
      });

      // TABLE SECTION

      currentY += 20;

      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
        if (options.watermark !== false) addWatermark(doc);
      }

      const tableTop = currentY;
      const rowHeight = 24;
      const tableLeft = 50;
      const tableRight = 550;

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

      function capitalizeName(name) {
        if (!name) return '';
        return name
          .toLowerCase()
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      function drawTableBorders(startY, endY) {
        doc
          .rect(tableLeft, startY, tableRight - tableLeft, endY - startY)
          .stroke();

        columns.forEach((col, i) => {
          if (i > 0) {
            doc.moveTo(col.x, startY).lineTo(col.x, endY).stroke();
          }
        });

        doc.moveTo(tableRight, startY).lineTo(tableRight, endY).stroke();
      }

      function drawTableHeader(y) {
        const headerHeight = 25;

        doc
          .rect(tableLeft, y, tableRight - tableLeft, headerHeight)
          .fill('#f5f5f5');

        drawTableBorders(y, y + headerHeight);

        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000');

        columns.forEach((col) => {
          const x = col.key === 'name' ? col.x + 3 : col.x;
          const w = col.key === 'name' ? col.width - 6 : col.width;
          doc.text(col.label, x, y + 8, { width: w, align: col.align });
        });

        return y + headerHeight;
      }

      let dataStartY = drawTableHeader(tableTop);
      let currentDataY = dataStartY;

      doc.font('Helvetica').fontSize(8);

      data.students.forEach((student, index) => {
        if (currentDataY + rowHeight > 710) {
          drawTableBorders(dataStartY, currentDataY);
          doc.addPage();
          if (options.watermark !== false) addWatermark(doc);
          currentDataY = 50;
          dataStartY = drawTableHeader(currentDataY);
          currentDataY = dataStartY;
        }

        if (index % 2 === 0) {
          doc
            .rect(tableLeft, currentDataY, tableRight - tableLeft, rowHeight)
            .fill('#fafafa');
        }

        doc.fillColor('#000');

        doc.text(index + 1, columns[0].x, currentDataY + 8, {
          width: columns[0].width,
          align: 'center',
        });

        doc.text(
          (student.matricNo || '').toUpperCase(),
          columns[1].x,
          currentDataY + 8,
          {
            width: columns[1].width,
            align: 'center',
          }
        );

        doc.text(
          capitalizeName(student.fullName),
          columns[2].x + 3,
          currentDataY + 8,
          { width: columns[2].width - 6, align: 'left' }
        );

        doc.text(
          `S${student.enrolledAtSession || 1}`,
          columns[3].x,
          currentDataY + 8,
          {
            width: columns[3].width,
            align: 'center',
          }
        );

        doc.text(
          student.totalSessions.toString(),
          columns[4].x,
          currentDataY + 8,
          {
            width: columns[4].width,
            align: 'center',
          }
        );

        doc.text(
          student.totalAttended.toString(),
          columns[5].x,
          currentDataY + 8,
          {
            width: columns[5].width,
            align: 'center',
          }
        );

        doc.text(
          student.totalAbsent.toString(),
          columns[6].x,
          currentDataY + 8,
          {
            width: columns[6].width,
            align: 'center',
          }
        );

        doc.font('Helvetica-Bold');

        const percentage = student.attendancePercentage;
        if (percentage >= 75) doc.fillColor('#16a34a');
        else if (percentage >= 50) doc.fillColor('#f59e0b');
        else doc.fillColor('#dc2626');

        doc.text(`${percentage.toFixed(1)}%`, columns[7].x, currentDataY + 8, {
          width: columns[7].width,
          align: 'center',
        });

        doc.font('Helvetica');

        if (student.eligible) {
          doc.fillColor('#16a34a').text('Yes', columns[8].x, currentDataY + 8, {
            width: columns[8].width,
            align: 'center',
          });
        } else {
          doc.fillColor('#dc2626').text('No', columns[8].x, currentDataY + 8, {
            width: columns[8].width,
            align: 'center',
          });
        }

        doc.fillColor('#000');
        doc
          .moveTo(tableLeft, currentDataY + rowHeight)
          .lineTo(tableRight, currentDataY + rowHeight)
          .stroke();

        currentDataY += rowHeight;
      });

      if (currentDataY > dataStartY) {
        drawTableBorders(dataStartY, currentDataY);
      }

      // FOOTER SECTION
      const footerY = Math.max(currentDataY + 20, doc.page.height - 110);

      doc
        .moveTo(50, footerY - 10)
        .lineTo(550, footerY - 10)
        .stroke();

      doc.fontSize(10).font('Helvetica').fillColor('#000');

      doc.text('Prepared by: _______________________', 50, footerY, {
        width: 240,
      });

      doc.text('Approved by: _______________________', 310, footerY, {
        width: 240,
      });

      const generatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc.text(`Generated on: ${generatedDate}`, 50, footerY + 25);

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

      const poweredByY = doc.page.height - 30;
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .fillColor('#666')
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

function addWatermark(doc) {
  const watermarkText = 'CONFIDENTIAL';

  doc.save();

  doc
    .translate(doc.page.width / 2, doc.page.height / 2)
    .rotate(-45)
    .fontSize(80)
    .font('Helvetica-Bold')
    .fillColor('#000')
    .opacity(0.03)
    .text(watermarkText, -200, 0, {
      align: 'center',
      width: 400,
    });

  doc.restore();
}

module.exports = { generateAttendancePDF };
