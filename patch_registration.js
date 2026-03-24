const fs = require('fs');
const path = 'c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/registration.html';
let content = fs.readFileSync(path, 'utf8').split('\n');

// 1. Add enrollment fee UI (around line 157-158)
const uiInsertIdx = 157; // This is before line 158 (index 157 is line 158)
const uiBlock = `
                                <div class="form-group mb-24pt">
                                    <label class="form-label" for="enrollmentFee">Monto de Matrícula (Único):</label>
                                    <div class="input-group input-group-merge">
                                        <input id="enrollmentFee" type="number" class="form-control form-control-prepended"
                                            placeholder="Ej: 50000" value="0">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Gs.</div>
                                        </div>
                                    </div>
                                    <small class="text-muted">Este monto se registrará como un pago ya realizado hoy.</small>
                                </div>`;
content.splice(uiInsertIdx, 0, uiBlock);

// 2. Modify Success Alert (around line 192-194)
// Need to find the exact line after inserting UI
let alertIdx = content.findIndex(line => line.includes('id="successAlert"'));
if (alertIdx !== -1) {
    content[alertIdx + 1] = '                                <div><strong>¡Éxito!</strong> Alumno inscrito y plan de cuotas generado correctamente.</div>';
    content.splice(alertIdx + 2, 0, `                                <div class="mt-2" id="successActions">
                                    <button type="button" class="btn btn-sm btn-success" id="btnPrintEnrollment">
                                        <i class="material-icons mr-1">print</i> Imprimir Comprobante de Matrícula
                                    </button>
                                </div>`);
}

// 3. Add JS Logic (around line 489 in original)
let jsIdx = content.findIndex(line => line.includes('from(\'installments\').insert(installments)'));
if (jsIdx !== -1) {
    // Look for the next audit log insert
    let auditIdx = -1;
    for (let i = jsIdx; i < content.length; i++) {
        if (content[i].includes('from(\'audit_log\').insert')) {
            auditIdx = i;
            break;
        }
    }
    if (auditIdx !== -1) {
        const jsBlock = `
                    // 3. Matrícula - Insertar como pagada si tiene monto
                    const enrollmentAmount = parseFloat($('#enrollmentFee').val()) || 0;
                    if (enrollmentAmount > 0) {
                        try {
                            const enrollmentData = {
                                student_id: student.id,
                                installment_number: 0,
                                due_date: new Date().toISOString().split('T')[0],
                                amount: enrollmentAmount,
                                paid_amount: enrollmentAmount,
                                status: 'pagado',
                                paid_at: new Date().toISOString(),
                                concept: 'MATRÍCULA'
                            };
                            await supabaseClient.from('installments').insert([enrollmentData]);
                        } catch (e) { console.error(e); }
                        
                        $('#btnPrintEnrollment').off('click').on('click', function() {
                            const params = new URLSearchParams({
                                id: student.id.split('-')[0],
                                name: student.full_name,
                                dni: student.dni,
                                concept: 'Matrícula',
                                amount: enrollmentAmount,
                                date: new Date().toLocaleDateString(),
                                course: $('#course option:selected').text()
                            });
                            window.open('ticket.html?' + params.toString(), 'Ticket', 'width=600,height=700');
                        });
                        $('#successActions').removeClass('d-none');
                    } else {
                        $('#successActions').addClass('d-none');
                    }
`;
        content.splice(auditIdx, 0, jsBlock);
        
        // Also update audit log details
        let detailsIdx = content.findIndex((line, i) => i > auditIdx && line.includes('details: {'));
        if (detailsIdx !== -1) {
            content[detailsIdx + 2] = '                            monthly_amount: amount, enrollment_fee: enrollmentAmount,';
        }
    }
}

fs.writeFileSync(path, content.join('\n'));
console.log("Successfully patched registration.html");
