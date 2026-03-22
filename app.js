/**
 * E-book GT11 - Main Application Logic
 * ระบบสร้างหน้า, Turn.js, Navigation, Search, TOC, Thumbnail
 */
$(document).ready(function () {
    // ===== ตัวแปรหลัก =====
    const flipbook = $('#flipbook');
    const isMobile = window.innerWidth <= 768;
    const tocEntries = [];    // เก็บข้อมูลสารบัญ { label, page, section }
    let totalPages = 0;

    // ===== แสดงข้อมูลโรงเรียน =====
    $('#school-info').text(ebookData.schoolDetails);

    // ===== ฟังก์ชันสร้างหน้า =====
    function addPage(html) {
        totalPages++;
        flipbook.append(html);
        return totalPages;
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatContact(contact) {
        if (!contact) return '';
        return escapeHtml(contact).replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }

    function pageNumHtml(num, side) {
        return `<span class="page-number ${side}">${num}</span>`;
    }

    // ===== 1. หน้าปก =====
    addPage(`
        <div class="page cover-page">
            <div class="page-inner">
                <div class="cover-border-frame">
                    <div class="cover-logo">
                        <img src="assets/logo.png" alt="School Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="cover-photo-frame">
                        <img src="assets/cover-photo.jpg" alt="Gifted Gen 11" onerror="this.parentElement.innerHTML='<span style=&quot;color:#888;font-size:0.8rem;&quot;>Gifted Gen 11 Class Photo</span>'">
                    </div>
                    <div class="cover-text-area">
                        <h1 class="title-yearbook">YEARBOOK</h1>
                        <h2 class="title-gen">- GIFTED GEN 11 -</h2>
                        <p class="title-date">GRADUATED 04-03-2026</p>
                        <p class="title-school">โรงเรียนกันทรารมณ์ สพม.ศรีสะเกษ ยโสธร</p>
                    </div>
                </div>
            </div>
        </div>
    `);

    // ===== 2. สารบัญ (หน้าที่ 2-3) =====
    addPage(`
        <div class="page toc-page" id="toc-page-1">
            <div class="page-inner">
                <h3 class="toc-title">TABLE OF CONTENTS</h3>
                <ul id="toc-list"></ul>
            </div>
        </div>
    `);
    addPage(`
        <div class="page toc-page" id="toc-page-2">
            <div class="page-inner">
                <h3 class="toc-title">TABLE OF CONTENTS (cont.)</h3>
                <ul id="toc-list-2"></ul>
            </div>
        </div>
    `);

    // ===== 3. Section 1: Messenger From Friends =====
    addPage(`
        <div class="page section-divider">
            <div class="page-inner">
                <div class="divider-icon">&#9993;</div>
                <h2 class="divider-title">MESSENGER FROM<br>FRIENDS</h2>
                <div class="divider-line"></div>
                <p class="divider-subtitle">AND WHERE TO FIND THEM</p>
                <p class="divider-subtitle" style="margin-top:12px;font-size:0.8rem;opacity:0.5;">ม.6/11 Gifted Gen 11</p>
            </div>
        </div>
    `);
    tocEntries.push({ label: '--- Messenger From Friends ---', page: totalPages, section: true });

    // ===== สร้างหน้านักเรียน (2 หน้าต่อนักเรียน) =====
    ebookData.students.forEach(function (s) {
        // หน้าที่ 1: รูป + ข้อมูลส่วนตัว + 3 ข้อความแรก
        const p1 = addPage(`
            <div class="page student-page-1" data-search="${escapeHtml(s.name)} ${escapeHtml(s.nickname)} ${escapeHtml(s.id)}">
                <div class="page-inner">
                    <div class="student-header">
                        <span class="student-id-badge">${escapeHtml(s.id)}</span>
                        <div>
                            <div class="student-name">${escapeHtml(s.name)}</div>
                            <div class="student-nickname">(${escapeHtml(s.nickname)})</div>
                        </div>
                    </div>
                    <div class="student-body">
                        <div class="student-photo-col">
                            <div class="photo-frame">
                                <img src="assets/students/${s.id}.jpg" alt="${escapeHtml(s.nickname)}" 
                                     onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=&quot;photo-frame-text&quot;>${escapeHtml(s.nickname)}</span>'">
                            </div>
                        </div>
                        <div class="student-text-col" id="s-text-${s.id}-${totalPages}">
                            <div class="msg-section">
                                <div class="msg-label">สิ่งที่อยากบอกเพื่อนๆ</div>
                                <div class="msg-text">${escapeHtml(s.friends)}</div>
                            </div>
                            <div class="msg-section">
                                <div class="msg-label">สิ่งที่อยากบอกรุ่นน้อง</div>
                                <div class="msg-text">${escapeHtml(s.juniors)}</div>
                            </div>
                            <div class="msg-section">
                                <div class="msg-label">สิ่งที่อยากบอกคุณครู</div>
                                <div class="msg-text">${escapeHtml(s.teachers)}</div>
                            </div>
                        </div>
                    </div>
                    ${pageNumHtml(totalPages, 'left')}
                </div>
            </div>
        `);
        tocEntries.push({ label: `${s.name} (${s.nickname})`, page: p1, section: false });

        // หน้าที่ 2: ข้อความเพิ่มเติม + คติพจน์ + ช่องทางติดต่อ
        addPage(`
            <div class="page student-page-2" data-search="${escapeHtml(s.name)} ${escapeHtml(s.nickname)} ${escapeHtml(s.id)}">
                <div class="page-inner">
                    <div class="student-page-2-header">${escapeHtml(s.name)} (${escapeHtml(s.nickname)})</div>
                    <div class="student-content-2" id="s-text2-${s.id}-${totalPages}">
                        <div class="msg-section">
                            <div class="msg-label">สิ่งที่อยากบอกน้องรหัส/หลานรหัส</div>
                            <div class="msg-text">${escapeHtml(s.lineage)}</div>
                        </div>
                        <div class="msg-section">
                            <div class="msg-label">ความรู้สึกถึงห้อง Gifted</div>
                            <div class="msg-text">${escapeHtml(s.gifted)}</div>
                        </div>
                        <div class="motto-contact-box">
                            <div class="motto-text">"${escapeHtml(s.motto)}"</div>
                            <div class="contact-text">${formatContact(s.contact)}</div>
                        </div>
                    </div>
                    ${pageNumHtml(totalPages, 'right')}
                </div>
            </div>
        `);
    });

    // ===== 4. Section 2: Gifted Teacher Messenger =====
    addPage(`
        <div class="page section-divider">
            <div class="page-inner">
                <div class="divider-icon">&#128218;</div>
                <h2 class="divider-title">GIFTED TEACHER<br>MESSENGER</h2>
                <div class="divider-line"></div>
                <p class="divider-subtitle">ข้อความจากคุณครูถึงลูกศิษย์ Gen 11</p>
            </div>
        </div>
    `);
    tocEntries.push({ label: '--- Gifted Teacher Messenger ---', page: totalPages, section: true });

    ebookData.teachers.forEach(function (t) {
        const tp = addPage(`
            <div class="page teacher-page" data-search="${escapeHtml(t.name)} ${escapeHtml(t.role)}">
                <div class="page-inner">
                    <div class="teacher-header">
                        <div class="teacher-name">${escapeHtml(t.name)}</div>
                        <div class="teacher-role">${escapeHtml(t.role)}</div>
                    </div>
                    <div class="teacher-body">
                        <div class="teacher-photo-col">
                            <div class="teacher-photo-frame">
                                <img src="assets/teachers/${t.id}.jpg" alt="${escapeHtml(t.name)}" 
                                     onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=&quot;color:#888;font-size:0.7rem;text-align:center;&quot;>${escapeHtml(t.name)}</span>'">
                            </div>
                        </div>
                        <div class="teacher-msg-area" id="t-text-${t.id}">
                            <div class="teacher-msg-label">ข้อความถึง Gen 11</div>
                            <div class="teacher-msg-text">"${escapeHtml(t.msg)}"</div>
                        </div>
                    </div>
                    ${pageNumHtml(totalPages, 'right')}
                </div>
            </div>
        `);
        tocEntries.push({ label: t.name, page: tp, section: false });
    });

    // ===== 5. Section 3: Juniors to Seniors =====
    addPage(`
        <div class="page section-divider">
            <div class="page-inner">
                <div class="divider-icon">&#128140;</div>
                <h2 class="divider-title">JUNIORS TO<br>SENIORS</h2>
                <div class="divider-line"></div>
                <p class="divider-subtitle">ข้อความจากตัวแทนรุ่นน้องถึงรุ่นพี่ Gen 11</p>
            </div>
        </div>
    `);
    tocEntries.push({ label: '--- Juniors to Seniors ---', page: totalPages, section: true });

    ebookData.juniorsGeneral.forEach(function (j) {
        const jp = addPage(`
            <div class="page junior-page" data-search="${escapeHtml(j.name)} ${escapeHtml(j.role)}">
                <div class="page-inner">
                    <div class="junior-header">
                        <div class="junior-name">${escapeHtml(j.name)}</div>
                        <div class="junior-role">${escapeHtml(j.role)}</div>
                    </div>
                    <div class="junior-body">
                        <div class="junior-photo-frame">
                            <img src="assets/juniors/${j.id}.jpg" alt="${escapeHtml(j.name)}" 
                                 onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=&quot;color:#888;font-size:0.65rem;&quot;>${escapeHtml(j.name)}</span>'">
                        </div>
                        <div class="junior-msg-text" id="j-text-${j.id}">
                            "${escapeHtml(j.msg)}"
                        </div>
                    </div>
                    ${pageNumHtml(totalPages, 'left')}
                </div>
            </div>
        `);
        tocEntries.push({ label: j.name, page: jp, section: false });
    });

    // ===== 6. Section 4: ข้อความจากสายรหัส =====
    addPage(`
        <div class="page section-divider">
            <div class="page-inner">
                <div class="divider-icon">&#128279;</div>
                <h2 class="divider-title">JUNIORS TO SENIORS</h2>
                <div class="divider-line"></div>
                <p class="divider-subtitle">ข้อความจากน้องรหัส/หลานรหัส ถึงพี่รหัส</p>
            </div>
        </div>
    `);
    tocEntries.push({ label: '--- ข้อความจากสายรหัส ---', page: totalPages, section: true });

    // จัดกลุ่มข้อความตามรหัสฐาน (เช่น 009, 009_2 → กลุ่ม 009)
    const lineageGroups = {};
    ebookData.lineages.forEach(function (l) {
        const baseCode = l.id.replace(/_\d+$/, '');
        if (!lineageGroups[baseCode]) lineageGroups[baseCode] = [];
        lineageGroups[baseCode].push(l);
    });

    // เรียงลำดับตามรหัส
    const sortedCodes = Object.keys(lineageGroups).sort(function (a, b) {
        return parseInt(a) - parseInt(b);
    });

    sortedCodes.forEach(function (code) {
        const msgs = lineageGroups[code];
        // คำนวณจำนวน message ที่ใส่ได้ในหนึ่งหน้า (ประมาณ 4-5 messages สั้นๆ)
        // ถ้า message ยาวมากหรือมีหลายข้อความ ให้แบ่งหลายหน้า
        const chunks = chunkLineageMessages(msgs);

        chunks.forEach(function (chunk, idx) {
            const messagesHtml = chunk.map(function (m) {
                return `
                    <div class="lineage-msg-item">
                        <div class="lineage-msg-to">ถึง: ${escapeHtml(m.to)}</div>
                        <div class="lineage-msg-text">${escapeHtml(m.msg)}</div>
                    </div>`;
            }).join('');

            const searchData = chunk.map(function (m) { return m.to; }).join(' ');
            const lp = addPage(`
                <div class="page lineage-page" data-search="สายรหัส ${code} ${escapeHtml(searchData)}">
                    <div class="page-inner">
                        <div class="lineage-code-header">
                            <span class="lineage-code-badge">${code}</span>
                            <span class="lineage-code-title">สายรหัส ${code}${chunks.length > 1 ? ' (' + (idx + 1) + '/' + chunks.length + ')' : ''}</span>
                        </div>
                        <div class="lineage-photo-area">
                            <img src="assets/lineages/lineage_${code}.jpg" alt="สายรหัส ${code}" 
                                 onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=&quot;color:#888;font-size:0.7rem;&quot;>สายรหัส ${code}</span>'">
                        </div>
                        <div class="lineage-messages">${messagesHtml}</div>
                        ${pageNumHtml(totalPages, (totalPages % 2 === 0 ? 'right' : 'left'))}
                    </div>
                </div>
            `);

            if (idx === 0) {
                tocEntries.push({ label: 'สายรหัส ' + code, page: lp, section: false });
            }
        });
    });

    // ===== 7. หน้าปิดท้าย =====
    addPage(`
        <div class="page closing-page">
            <div class="page-inner">
                <h2 class="closing-title">Thank You</h2>
                <div class="divider-line" style="background:var(--school-yellow);margin:0 auto 20px;"></div>
                <p class="closing-text">
                    ขอบคุณทุกความทรงจำดีๆ ที่เราได้สร้างร่วมกัน<br>
                    ตลอดระยะเวลา 3 ปี ในรั้วกันทรารมณ์<br><br>
                    Gifted Gen 11 - ม.6/11<br>
                    โรงเรียนกันทรารมณ์<br>
                    สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาศรีสะเกษ ยโสธร<br><br>
                    <span style="font-size:0.75rem;opacity:0.6;">GRADUATED 04-03-2026</span>
                </p>
            </div>
        </div>
    `);

    // ===== ฟังก์ชันแบ่ง Lineage Messages เป็น Chunks =====
    function chunkLineageMessages(msgs) {
        // ถ้าข้อความทั้งหมดรวมกันสั้น ใส่หน้าเดียว
        const totalLen = msgs.reduce(function (sum, m) { return sum + m.msg.length; }, 0);
        if (totalLen <= 1200 && msgs.length <= 5) return [msgs];
        // แบ่งตามความยาว
        const chunks = [];
        let current = [];
        let currentLen = 0;
        msgs.forEach(function (m) {
            if (currentLen + m.msg.length > 1200 && current.length > 0) {
                chunks.push(current);
                current = [];
                currentLen = 0;
            }
            current.push(m);
            currentLen += m.msg.length;
        });
        if (current.length > 0) chunks.push(current);
        return chunks;
    }

    // ===== 8. สร้างสารบัญในหน้า E-book =====
    const tocList1 = $('#toc-list');
    const tocList2 = $('#toc-list-2');
    const halfIndex = Math.ceil(tocEntries.length / 2);

    tocEntries.forEach(function (entry, i) {
        const targetList = (i < halfIndex) ? tocList1 : tocList2;
        if (entry.section) {
            targetList.append(`<li class="toc-section-title">${entry.label.replace(/---/g, '').trim()}</li>`);
        } else {
            targetList.append(`<li><a href="#" class="toc-link" data-page="${entry.page}">${entry.label} <span class="toc-page-num">p.${entry.page}</span></a></li>`);
        }
    });

    // ===== 9. สร้าง TOC Sidebar =====
    const tocContent = $('#toc-content');
    tocEntries.forEach(function (entry) {
        if (entry.section) {
            tocContent.append(`<div class="toc-section-header">${entry.label.replace(/---/g, '').trim()}</div>`);
        } else {
            tocContent.append(`<a class="toc-item" data-page="${entry.page}">${entry.label}</a>`);
        }
    });

    // ===== 10. Auto-Scale ข้อความให้พอดีหน้า =====
    function autoScaleText() {
        // สำหรับหน้านักเรียน - ย่อขนาดข้อความถ้าล้น
        $('.student-text-col, .student-content-2, .teacher-msg-area').each(function () {
            const el = this;
            const parent = el.closest('.page-inner');
            if (!parent) return;

            let fontSize = parseFloat(window.getComputedStyle(el).fontSize) || 11;
            const minFont = 7.5;
            let attempts = 0;

            while (el.scrollHeight > el.clientHeight && fontSize > minFont && attempts < 20) {
                fontSize -= 0.3;
                $(el).find('.msg-text, .teacher-msg-text, .motto-text, .contact-text').css('font-size', fontSize + 'px');
                attempts++;
            }
        });
    }

    // ===== 11. ตั้งค่า Turn.js หรือ Mobile Mode =====
    if (!isMobile) {
        // Desktop: ใช้ Turn.js page flip
        flipbook.turn({
            width: 1100,
            height: 750,
            autoCenter: true,
            gradients: true,
            acceleration: true,
            when: {
                turning: function (e, page) {
                    updatePageDisplay(page);
                },
                turned: function (e, page) {
                    // เปิดใช้ animation สำหรับหน้าที่เปิดอยู่
                    $('.page').removeClass('active-page');
                    $(this).turn('view').forEach(function (v) {
                        if (v) $('.page').eq(v - 1).addClass('active-page');
                    });
                }
            }
        });

        // ตั้งค่า Slider
        $('#page-slider').attr('max', totalPages).val(1);

        // Resize handler
        function resizeFlipbook() {
            const viewport = $('#ebook-viewport');
            const targetW = 1150;
            const targetH = 780;
            const scaleW = viewport.width() / targetW;
            const scaleH = viewport.height() / targetH;
            const scale = Math.min(scaleW, scaleH, 1);
            flipbook.css({
                'transform': 'scale(' + scale + ')',
                'transform-origin': 'center center'
            });
        }
        resizeFlipbook();
        $(window).resize(resizeFlipbook);

        // ===== Navigation Controls =====
        $('#prev-btn').click(function () { flipbook.turn('previous'); });
        $('#next-btn').click(function () { flipbook.turn('next'); });

        $('#page-jump').on('change', function () {
            const p = parseInt($(this).val());
            if (p >= 1 && p <= totalPages) flipbook.turn('page', p);
        });

        $('#page-slider').on('input', function () {
            const p = parseInt($(this).val());
            updatePageDisplay(p);
        });
        $('#page-slider').on('change', function () {
            const p = parseInt($(this).val());
            flipbook.turn('page', p);
        });

        // Keyboard navigation
        $(document).keydown(function (e) {
            if (e.target.tagName === 'INPUT') return;
            if (e.key === 'ArrowLeft') flipbook.turn('previous');
            if (e.key === 'ArrowRight') flipbook.turn('next');
        });

        // คลิกลิงก์สารบัญ (ในหน้า e-book)
        $(document).on('click', '.toc-link', function (e) {
            e.preventDefault();
            flipbook.turn('page', parseInt($(this).data('page')));
        });

        // คลิกลิงก์สารบัญ (ใน overlay sidebar)
        $(document).on('click', '.toc-item', function () {
            flipbook.turn('page', parseInt($(this).data('page')));
            closeTocOverlay();
        });

        // Deep linking
        if (window.location.hash) {
            const hashPage = parseInt(window.location.hash.split('/')[1]);
            if (!isNaN(hashPage) && hashPage >= 1 && hashPage <= totalPages) {
                flipbook.turn('page', hashPage);
            }
        }

    } else {
        // Mobile: ปิด Turn.js ใช้ Vertical Scroll
        $('#page-num').text('โหมดเลื่อนดู (Mobile)');
        $('#page-slider').hide();

        $(document).on('click', '.toc-link, .toc-item', function (e) {
            e.preventDefault();
            const targetPage = parseInt($(this).data('page'));
            const targetEl = $('.page').eq(targetPage - 1);
            if (targetEl.length) {
                $('html, body').animate({ scrollTop: targetEl.offset().top - 60 }, 500);
            }
            closeTocOverlay();
        });
    }

    function updatePageDisplay(page) {
        $('#page-num').text('หน้า ' + page + ' / ' + totalPages);
        $('#page-slider').val(page);
        window.location.hash = 'page/' + page;
    }

    // ===== 12. ระบบค้นหา =====
    function performSearch() {
        const query = $('#search-input').val().toLowerCase().trim();
        if (!query) return;

        let foundPage = -1;
        $('.page').each(function (index) {
            const searchData = $(this).attr('data-search');
            if (searchData && searchData.toLowerCase().includes(query)) {
                foundPage = index + 1;
                return false;
            }
        });

        if (foundPage !== -1) {
            if (!isMobile) {
                flipbook.turn('page', foundPage);
            } else {
                const targetEl = $('.page').eq(foundPage - 1);
                if (targetEl.length) {
                    $('html, body').animate({ scrollTop: targetEl.offset().top - 60 }, 500);
                }
            }
        } else {
            alert('ไม่พบข้อมูลที่ค้นหา "' + query + '"');
        }
    }

    $('#btn-search').click(performSearch);
    $('#search-input').on('keypress', function (e) {
        if (e.key === 'Enter') performSearch();
    });

    // ===== 13. TOC Overlay =====
    function openTocOverlay() {
        $('#toc-overlay').addClass('active');
    }
    function closeTocOverlay() {
        $('#toc-overlay').removeClass('active');
    }

    $('#btn-toc').click(openTocOverlay);
    $('#toc-overlay').click(function (e) {
        if (e.target === this) closeTocOverlay();
    });

    // ===== 14. Thumbnail Overview =====
    function openThumbnailOverlay() {
        const grid = $('#thumbnail-grid');
        grid.empty();

        $('.page').each(function (index) {
            const pageNum = index + 1;
            let label = 'หน้า ' + pageNum;

            // ค้นหา label จาก tocEntries
            for (let i = 0; i < tocEntries.length; i++) {
                if (tocEntries[i].page === pageNum && !tocEntries[i].section) {
                    label = tocEntries[i].label;
                    break;
                }
            }

            // ตรวจสอบประเภทหน้า
            const $page = $(this);
            let bgColor = '#FFF9F0';
            let textColor = '#333';
            let displayText = label;

            if ($page.hasClass('cover-page')) {
                bgColor = '#5E1619'; textColor = '#F4D383'; displayText = 'YEARBOOK';
            } else if ($page.hasClass('section-divider')) {
                bgColor = '#1B5E20'; textColor = '#F1C40F';
                displayText = $page.find('.divider-title').text().replace(/<br>/g, ' ').substring(0, 20);
            } else if ($page.hasClass('toc-page')) {
                displayText = 'สารบัญ';
            } else if ($page.hasClass('closing-page')) {
                bgColor = '#1B5E20'; textColor = '#F1C40F'; displayText = 'Thank You';
            }

            grid.append(`
                <div class="thumb-item" data-page="${pageNum}" style="background:${bgColor};color:${textColor};">
                    <div style="font-weight:bold;font-size:0.7rem;">${pageNum}</div>
                    <div class="thumb-label">${displayText}</div>
                </div>
            `);
        });

        $('#thumbnail-overlay').addClass('active');
        $('#thumbnail-close').addClass('active');
    }

    function closeThumbnailOverlay() {
        $('#thumbnail-overlay').removeClass('active');
        $('#thumbnail-close').removeClass('active');
    }

    $('#btn-thumbnail').click(openThumbnailOverlay);
    $('#thumbnail-close').click(closeThumbnailOverlay);
    $('#thumbnail-overlay').on('click', '.thumb-item', function () {
        const page = parseInt($(this).data('page'));
        closeThumbnailOverlay();
        if (!isMobile) {
            flipbook.turn('page', page);
        } else {
            const targetEl = $('.page').eq(page - 1);
            if (targetEl.length) {
                $('html, body').animate({ scrollTop: targetEl.offset().top - 60 }, 500);
            }
        }
    });

    // ===== 15. Auto-Scale และปิดหน้าโหลด =====
    setTimeout(function () {
        autoScaleText();
        $('#loading-screen').addClass('hidden');
    }, 600);

    // เรียก auto-scale อีกครั้งหลังจาก Turn.js render เสร็จ
    setTimeout(autoScaleText, 1500);
});