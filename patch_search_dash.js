const fs = require('fs');

// PATCH SEARCH.HTML
(function() {
    const path = 'c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/search.html';
    let content = fs.readFileSync(path, 'utf8').split('\n');
    
    // 1. Update query to select concept
    let queryIdx = content.findIndex(line => line.includes('from(\'installments\').select(\'*\')'));
    if (queryIdx !== -1) {
        // Already selects * so it's fine
    }

    // 2. Update renderInstallments logic
    let totalCountIdx = content.findIndex(line => line.includes('var totalCount = installments.length;'));
    if (totalCountIdx !== -1) {
        content[totalCountIdx] = '            var totalInstallments = installments.filter(i => i.concept !== \'MATRÍCULA\').length;';
    }

    // Replace installment number display
    let rowIdx = content.findIndex(line => line.includes('js-lists-values-num'));
    if (rowIdx !== -1) {
        content[rowIdx] = "                    '<td><strong class=\"js-lists-values-num\">' + (item.concept === 'MATRÍCULA' ? 'Matrícula' : 'Cuota ' + item.installment_number + ' de ' + totalInstallments) + '</strong></td>' +";
    }

    // Update ticket button data-total
    let ticketTotalIdx = content.findIndex(line => line.includes('data-total="\' + totalCount + \'"'));
    if (ticketTotalIdx !== -1) {
        content[ticketTotalIdx] = "                        ' data-total=\"' + totalInstallments + '\"' +";
    }
    
    // Update printTicket signature and usage
    let printTicketUsageIdx = content.findIndex(line => line.includes('printTicket('));
    if (printTicketUsageIdx !== -1 && content[printTicketUsageIdx].includes('btn.data(\'id\')')) {
       // It spans multiple lines
       content[printTicketUsageIdx + 6] = "                    btn.data('course'),";
       content.splice(printTicketUsageIdx + 7, 0, "                    btn.data('concept')");
    }
    
    let btnTicketRowIdx = content.findIndex(line => line.includes('btn-ticket mr-8pt'));
    if (btnTicketRowIdx !== -1) {
        content.splice(btnTicketRowIdx + 8, 0, "                        ' data-concept=\"' + (item.concept === 'MATRÍCULA' ? 'Matrícula' : '') + '\"' +");
    }

    let printTicketDefIdx = content.findIndex(line => line.includes('function printTicket(id, num, name, dni, date, amountPaid, totalCount, totalInstallmentAmount, remainingAmount, course)'));
    if (printTicketDefIdx !== -1) {
        content[printTicketDefIdx] = "        function printTicket(id, num, name, dni, date, amountPaid, totalCount, totalInstallmentAmount, remainingAmount, course, concept) {";
        content[printTicketDefIdx + 1] = "            var params = new URLSearchParams({ id:id, num:num, name:name, dni:dni, date:date, amount:amountPaid, total:totalCount, totalAmount:totalInstallmentAmount, remaining:remainingAmount, course:course, concept:concept });";
    }

    fs.writeFileSync(path, content.join('\n'));
    console.log("Successfully patched search.html");
})();

// PATCH DASHBOARD.HTML
(function() {
    const path = 'c:/Users/Produ/Documents/luma-v2.0.0/Demos/CMS/dashboard.html';
    let content = fs.readFileSync(path, 'utf8').split('\n');

    // 1. Update loadRecentPayments to fetch and show concept
    let recIdx = content.findIndex(line => line.includes('from(\'installments\').select(\'amount, paid_at, installment_number, students(full_name, branches(name))\')'));
    if (recIdx !== -1) {
        content[recIdx] = content[recIdx].replace('installment_number', 'installment_number, concept');
        let appendIdx = content.findIndex((line, i) => i > recIdx && line.includes('list.append'));
        if (appendIdx !== -1) {
            content[appendIdx] = content[appendIdx].replace('p.students.full_name', 'p.students.full_name + (p.concept === "MATRÍCULA" ? " (Matrícula)" : "")');
        }
    }

    // 2. Update loadBillingBreakdown
    let billIdx = content.findIndex(line => line.includes('from(\'installments\').select(\'id, amount, paid_at, installment_number, students(full_name, dni, branches(name), courses(name))\')'));
    if (billIdx !== -1) {
        content[billIdx] = content[billIdx].replace('installment_number', 'installment_number, concept');
        let billTableIdx = content.findIndex((line, i) => i > billIdx && line.includes('tbody.append'));
        if (billTableIdx !== -1) {
            content[billTableIdx] = content[billTableIdx].replace('Cuota ${p.installment_number}', '${p.concept === "MATRÍCULA" ? "Matrícula" : "Cuota " + p.installment_number}');
            content[billTableIdx] = content[billTableIdx].replace('${p.students.courses.name}\')', '${p.students.courses.name}\', \'${p.concept === "MATRÍCULA" ? "Matrícula" : ""}\')');
        }
    }

    // 3. Update printTicket signature
    let printIdx = content.findIndex(line => line.includes('function printTicket(id, num, name, dni, date, amount, total, totalA, rem, course)'));
    if (printIdx !== -1) {
        content[printIdx] = "        function printTicket(id, num, name, dni, date, amount, total, totalA, rem, course, concept) { window.open(`ticket.html?id=${id}&num=${num}&name=${name}&amount=${amount}&course=${course}&concept=${concept || ''}`, '_blank'); }";
    }

    fs.writeFileSync(path, content.join('\n'));
    console.log("Successfully patched dashboard.html");
})();
