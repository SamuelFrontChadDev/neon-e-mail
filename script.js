/**
 * NEON//MAIL - Terminal System v2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Estado local do sistema
    const state = {
      history: [
        { id: 'TX-9021', to: 'alex@cyberpunk.net', subject: 'Acesso aos arquivos', date: '07/10/2026 19:30', status: 'SENT' },
        { id: 'TX-8842', to: 'sam@synth.org', subject: 'Reunião de diretoria', date: '06/10/2026 14:15', status: 'FAILED' }
      ],
      settings: {
        theme: 'theme-purple',
        crt: true,
        sound: false
      }
    };
  
    // Referências do DOM
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
  
    const emailForm = document.getElementById('emailForm');
    const recipientEmail = document.getElementById('recipientEmail');
    const recipientName = document.getElementById('recipientName');
    const emailSubject = document.getElementById('emailSubject');
    const emailMessage = document.getElementById('emailMessage');
    const charCounter = document.getElementById('charCounter');
    
    const prevTo = document.getElementById('prevTo');
    const prevSubject = document.getElementById('prevSubject');
    const prevBody = document.getElementById('prevBody');
  
    const btnClear = document.getElementById('btnClear');
    const btnResetForm = document.getElementById('btnResetForm');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    const progressPercent = document.getElementById('progressPercent');
    const statusBox = document.getElementById('statusBox');
  
    const themeSelect = document.getElementById('themeSelect');
    const toggleCRT = document.getElementById('toggleCRT');
    const toggleSound = document.getElementById('toggleSound');
    const historyTableBody = document.getElementById('historyTableBody');
    const historySearch = document.getElementById('historySearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
  
    // Popover de Emojis
    const emojiToggleBtn = document.getElementById('emojiToggleBtn');
    const emojiPopover = document.getElementById('emojiPopover');
    const emojiCloseBtn = document.getElementById('emojiCloseBtn');
    const emojiGrid = document.getElementById('emojiGrid');
  
    /* ==========================================================================
       1. NAVEGAÇÃO ENTRE SEÇÕES (CORRIGIDO)
       ========================================================================== */
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
  
        const targetId = btn.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
  
        if (targetSection) {
          // Remove estado ativo de todos os botões e seções
          navButtons.forEach(b => b.classList.remove('active'));
          sections.forEach(s => s.classList.remove('active'));
  
          // Ativa apenas a seção e botão selecionados
          btn.classList.add('active');
          targetSection.classList.add('active');
  
          // Fecha menu hambúrguer no mobile
          if (navMenu) {
            navMenu.classList.remove('open');
          }
        }
      });
    });
  
    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }
  
    /* ==========================================================================
       2. PRÉ-VISUALIZAÇÃO EM TEMPO REAL
       ========================================================================== */
    function updatePreview() {
      if (prevTo) prevTo.textContent = recipientEmail.value.trim() || '---';
      if (prevSubject) prevSubject.textContent = emailSubject.value.trim() || '---';
      if (prevBody) prevBody.textContent = emailMessage.value || 'Aguardando dados...';
    }
  
    if (recipientEmail) recipientEmail.addEventListener('input', updatePreview);
    if (emailSubject) emailSubject.addEventListener('input', updatePreview);
    if (emailMessage) {
      emailMessage.addEventListener('input', () => {
        updatePreview();
        if (charCounter) {
          charCounter.textContent = `${emailMessage.value.length} / 5000`;
        }
      });
    }
  
    /* ==========================================================================
       3. EDITOR DE TEXTO (FORMATOS & EMOJIS)
       ========================================================================== */
    document.querySelectorAll('.tool-btn[data-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!emailMessage) return;
        const tag = btn.dataset.tag;
        const start = emailMessage.selectionStart;
        const end = emailMessage.selectionEnd;
        const text = emailMessage.value;
        const selected = text.substring(start, end);
  
        emailMessage.value = text.substring(0, start) + `<${tag}>${selected}</${tag}>` + text.substring(end);
        emailMessage.focus();
        updatePreview();
      });
    });
  
    if (emojiToggleBtn && emojiPopover) {
      emojiToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPopover.classList.toggle('hidden');
      });
    }
  
    if (emojiCloseBtn && emojiPopover) {
      emojiCloseBtn.addEventListener('click', () => {
        emojiPopover.classList.add('hidden');
      });
    }
  
    if (emojiGrid && emailMessage) {
      emojiGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('emoji-item')) {
          const emoji = e.target.textContent;
          const start = emailMessage.selectionStart;
          const end = emailMessage.selectionEnd;
          const text = emailMessage.value;
  
          emailMessage.value = text.substring(0, start) + emoji + text.substring(end);
          emailMessage.selectionStart = emailMessage.selectionEnd = start + emoji.length;
          emailMessage.focus();
  
          updatePreview();
          if (charCounter) charCounter.textContent = `${emailMessage.value.length} / 5000`;
          if (emojiPopover) emojiPopover.classList.add('hidden');
        }
      });
    }
  
    document.addEventListener('click', (e) => {
      if (emojiPopover && !emojiPopover.contains(e.target) && e.target !== emojiToggleBtn) {
        emojiPopover.classList.add('hidden');
      }
    });
  
    /* ==========================================================================
       4. VALIDAÇÃO E ENVIO DE MENSAGEM
       ========================================================================== */
    function validateForm() {
      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(recipientEmail.value.trim())) {
        recipientEmail.closest('.form-group')?.classList.add('invalid');
        isValid = false;
      } else {
        recipientEmail.closest('.form-group')?.classList.remove('invalid');
      }
  
      if (!emailSubject.value.trim()) {
        emailSubject.closest('.form-group')?.classList.add('invalid');
        isValid = false;
      } else {
        emailSubject.closest('.form-group')?.classList.remove('invalid');
      }
  
      if (!emailMessage.value.trim()) {
        emailMessage.closest('.form-group')?.classList.add('invalid');
        isValid = false;
      } else {
        emailMessage.closest('.form-group')?.classList.remove('invalid');
      }
  
      return isValid;
    }
  
    if (emailForm) {
      emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
  
        emailForm.classList.add('hidden');
        if (progressContainer) progressContainer.classList.remove('hidden');
        if (statusBox) statusBox.classList.add('hidden');
  
        const steps = [
          { pct: 25, text: 'CONNECTING_TO_NODES...' },
          { pct: 60, text: 'ENCRYPTING_PAYLOAD...' },
          { pct: 90, text: 'DISPATCHING_SIGNAL...' },
          { pct: 100, text: 'TRANSMISSION_COMPLETE' }
        ];
  
        for (let step of steps) {
          await new Promise(res => setTimeout(res, 400));
          if (progressBar) progressBar.style.width = `${step.pct}%`;
          if (progressPercent) progressPercent.textContent = `${step.pct}%`;
          if (progressStatus) progressStatus.textContent = step.text;
        }
  
        setTimeout(() => {
          if (progressContainer) progressContainer.classList.add('hidden');
          if (statusBox) statusBox.classList.remove('hidden');
  
          state.history.unshift({
            id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
            to: recipientEmail.value,
            subject: emailSubject.value,
            date: new Date().toLocaleString('pt-BR'),
            status: 'SENT'
          });
  
          renderHistory();
          updateSystemStats();
        }, 300);
      });
    }
  
    function resetForm() {
      if (emailForm) emailForm.reset();
      updatePreview();
      if (charCounter) charCounter.textContent = '0 / 5000';
      if (emailForm) emailForm.classList.remove('hidden');
      if (statusBox) statusBox.classList.add('hidden');
      if (progressContainer) progressContainer.classList.add('hidden');
      if (progressBar) progressBar.style.width = '0%';
    }
  
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('CLEAR CURRENT TRANSMISSION?')) resetForm();
      });
    }
  
    if (btnResetForm) btnResetForm.addEventListener('click', resetForm);
  
    /* ==========================================================================
       5. HISTÓRICO DE TRANSMISSÕES
       ========================================================================== */
    function renderHistory(filter = 'ALL', search = '') {
      if (!historyTableBody) return;
      historyTableBody.innerHTML = '';
  
      const filtered = state.history.filter(item => {
        const matchesFilter = filter === 'ALL' || item.status === filter;
        const matchesSearch = item.to.toLowerCase().includes(search.toLowerCase()) || 
                              item.subject.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      });
  
      if (filtered.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">NENHUM REGISTRO ENCONTRADO</td></tr>`;
        return;
      }
  
      filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.id}</td>
          <td>${item.to}</td>
          <td>${item.subject}</td>
          <td>${item.date}</td>
          <td><span class="status-tag ${item.status.toLowerCase()}">${item.status}</span></td>
        `;
        historyTableBody.appendChild(tr);
      });
    }
  
    if (historySearch) {
      historySearch.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'ALL';
        renderHistory(activeFilter, e.target.value);
      });
    }
  
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderHistory(btn.dataset.filter, historySearch ? historySearch.value : '');
      });
    });
  
    function updateSystemStats() {
      const sysMsgCount = document.getElementById('sysMsgCount');
      const lastTransDate = document.getElementById('lastTransDate');
  
      if (sysMsgCount) sysMsgCount.textContent = state.history.length;
      if (lastTransDate && state.history.length > 0) {
        lastTransDate.textContent = state.history[0].date;
      }
    }
  
   /* ==========================================================================
     6. CONFIGURAÇÕES E AJUSTES VISUAIS
     ========================================================================== */
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(e.target.value);
    });
  }

  if (toggleCRT) {
    toggleCRT.addEventListener('click', () => {
      state.settings.crt = !state.settings.crt;
      document.body.classList.toggle('crt-active', state.settings.crt);
      toggleCRT.textContent = `[ CRT: ${state.settings.crt ? 'ATIVADO' : 'DESATIVADO'} ]`;
    });
  }

  if (toggleSound) {
    toggleSound.addEventListener('click', () => {
      state.settings.sound = !state.settings.sound;
      toggleSound.textContent = `[ SOUND: ${state.settings.sound ? 'ATIVADO' : 'DESATIVADO'} ]`;
    });
  }

  // Inicialização das tabelas e informações do sistema
  renderHistory();
  updateSystemStats();
});