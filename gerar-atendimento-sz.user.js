// ==UserScript==
// @name         A4 Copiar Atendimento SZ.CHAT - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Cria um botão que extrai Protocolo, Nome e Telefone e copia formatado para o clipboard
// @author       Luiz Toledo
// @match        https://ggnet.sz.chat/user/agent*
// @grant        GM_setClipboard
// @run-at       document-idle
// @icon         https://raw.githubusercontent.com/devluiztoledo/gerar-atendimento-sz/main/icon.png
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/gerar-atendimento-sz/main/gerar-atendimento-sz.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/gerar-atendimento-sz/main/gerar-atendimento-sz.user.js
// ==/UserScript==



(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        const botoes = Array.from(document.querySelectorAll('a.item.text-ellipsis'));
        const btnExistente = document.querySelector('#btn-gerar-atendimento');

        const btnModelo = botoes.find(el => el.textContent.includes('Baixar Mídia'));
        if (!btnModelo || btnExistente) return;

        const novoBotao = btnModelo.cloneNode(true);
        novoBotao.id = 'btn-gerar-atendimento';
        novoBotao.innerHTML = 'Gerar atendimento';

        novoBotao.addEventListener('click', () => {
            try {

                const botoesAtuais = Array.from(document.querySelectorAll('a.item.text-ellipsis'));
                const protocoloEl = botoesAtuais.find(el => el.textContent.includes('Protocolo:'));
                const nomeEl = document.querySelector('h3.ui.header.mt-0.text-ellipsis');
                const telefoneEl = document.querySelector('small.mt-2');

                if (!protocoloEl || !nomeEl || !telefoneEl) {
                    alert('❌ Não foi possível encontrar os dados do atendimento.');
                    return;
                }

                const protocolo = protocoloEl.textContent.match(/Protocolo:\s*([0-9]+)/)?.[1] || '';
                const nome = nomeEl.textContent.trim();
                const telefone = telefoneEl.textContent.trim();

                const texto = `Atendimento pelo SZ.CHAT - Protocolo: ${protocolo} - Nome: ${nome} - Telefone: ${telefone}`;
                GM_setClipboard(texto);
                alert('✅ Dados copiados:\n\n' + texto);
            } catch (e) {
                alert('Erro ao copiar os dados: ' + e.message);
            }
        });

        btnModelo.parentElement.insertBefore(novoBotao, btnModelo.nextSibling);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
