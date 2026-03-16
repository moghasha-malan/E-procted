const { app, BrowserWindow, session, dialog } = require('electron');
const path = require('path');

let allowExit = false;
let warningCount = 0;
const maxWarnings = 3;

function createWindow() {
  const win = new BrowserWindow({
    kiosk: true,
    title: 'eShielded Secure Browser',
    icon: path.join(__dirname, 'icons', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
  });

  const filter = { urls: ['*://*/*'] };



  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    const allowedUrls = [
      'https://dash.eshielded.itshivam.in',
      'https://eshielded.itshivam.in/api',
      'https://generativelanguage.googleapis.com'
    ];
  
    const isAllowed = allowedUrls.some(url => details.url.startsWith(url));
  
    if (isAllowed) {
      callback({ cancel: false });
    } else {
      callback({ cancel: true });
    }
  });
  

  win.loadURL('https://dash.eshielded.itshivam.in');


  win.webContents.on('context-menu', e => e.preventDefault());

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && ['I', 'Shift', 'C', 'J'].includes(input.key.toUpperCase())) {
      event.preventDefault();
    }
    if (input.key === 'F12' || input.key === 'Escape') {
      event.preventDefault();
    }
  });


  win.on('blur', () => {
    warningCount++;

    if (warningCount <= maxWarnings) {
      win.webContents.executeJavaScript(`
        (function() {
      
          let existingBanner = document.getElementById('warning-banner');
          if (existingBanner) existingBanner.remove();
          
    
          let existingCountBox = document.getElementById('warning-count-box');
          if (existingCountBox) existingCountBox.remove();

 
          let warningBanner = document.createElement('div');
          warningBanner.id = 'warning-banner';
          warningBanner.style.position = 'fixed';
          warningBanner.style.top = '0';
          warningBanner.style.left = '0';
          warningBanner.style.width = '100%';
          warningBanner.style.padding = '15px';
          warningBanner.style.backgroundColor = '#ff4d4f';
          warningBanner.style.color = 'white';
          warningBanner.style.fontSize = '18px';
          warningBanner.style.fontWeight = 'bold';
          warningBanner.style.textAlign = 'center';
          warningBanner.style.zIndex = '100000';
          warningBanner.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.3)';
          warningBanner.style.display = 'flex';
          warningBanner.style.justifyContent = 'center';
          warningBanner.style.alignItems = 'center';
          

          let closeButton = document.createElement('div');
          closeButton.innerHTML = '&times;';
          closeButton.style.position = 'absolute';
          closeButton.style.right = '20px';
          closeButton.style.fontSize = '24px';
          closeButton.style.cursor = 'pointer';
          closeButton.style.padding = '0 10px';
          
          let warningMessage = document.createElement('div');
          if (${warningCount} < ${maxWarnings}) {
            warningMessage.innerText = "⚠️ Warning ${warningCount} of ${maxWarnings}: Switching tabs/windows is prohibited.";
          } else {
            warningMessage.innerText = "🚨 You have switched tabs/windows 3 times! This will be reported to Admin and your score may be deducted.";
            alert("WARNING ${warningCount} of ${maxWarnings}: Switching windows is not allowed!");
          }
          

          warningBanner.appendChild(warningMessage);
          warningBanner.appendChild(closeButton);
          document.body.appendChild(warningBanner);
          
          closeButton.onclick = function() {
            warningBanner.remove();
        
            let countBox = document.createElement('div');
            countBox.id = 'warning-count-box';
            countBox.style.position = 'fixed';
            countBox.style.top = '10px';
            countBox.style.left = '10px';
            countBox.style.width = '40px';
            countBox.style.height = '40px';
            countBox.style.backgroundColor = '#ff4d4f';
            countBox.style.color = 'white';
            countBox.style.borderRadius = '50%';
            countBox.style.display = 'flex';
            countBox.style.justifyContent = 'center';
            countBox.style.alignItems = 'center';
            countBox.style.fontWeight = 'bold';
            countBox.style.fontSize = '18px';
            countBox.style.zIndex = '100000';
            countBox.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.3)';
            countBox.style.cursor = 'pointer';
            countBox.innerText = '${warningCount}';
            
           
            countBox.onclick = function() {
              document.body.appendChild(warningBanner);
              countBox.remove();
            };
            
            document.body.appendChild(countBox);
          };
        })();
      `);
    }
  });



win.on('close', async (e) => {
  if (!allowExit) {
    e.preventDefault();

    const { response } = await dialog.showMessageBox(win, {
      type: 'warning',
      buttons: ['Cancel', 'Confirm Exit'],
      defaultId: 1,
      cancelId: 0,
      title: 'Confirm Exit',
      message: 'If you exit, you will be marked as plagiarism and your score will be ZERO.\n\nTo exit, you must type "I CONFIRM".'
    });

     if (response === 1) {
      const confirmExit = await win.webContents.executeJavaScript(`
          new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.85);
              backdrop-filter: blur(5px);
              z-index: 999999;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: 'Segoe UI', Roboto, sans-serif;
            \`;
            
            modal.innerHTML = \`
              <div style="
                background: linear-gradient(145deg, #2a0845, #6441a5);
                padding: 2.5rem;
                border-radius: 16px;
                text-align: center;
                width: 450px;
                max-width: 90%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                color: white;
                position: relative;
                overflow: hidden;
              ">
                <!-- Glow effect -->
                <div style="
                  position: absolute;
                  top: -50px;
                  right: -50px;
                  width: 200px;
                  height: 200px;
                  background: radial-gradient(circle, rgba(101,65,165,0.6) 0%, rgba(101,65,165,0) 70%);
                  z-index: 0;
                "></div>
                
                <div style="position: relative; z-index: 1;">
                  <div style="
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                  ">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF4D4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 8V12" stroke="#FF4D4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 16H12.01" stroke="#FF4D4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  
                  <h2 style="
                    color: #fff;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    letter-spacing: 0.5px;
                  ">
                    Exit Confirmation
                  </h2>
                  
                  <p style="
                    color: rgba(255,255,255,0.8);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                  ">
                    You are about to exit the secure browser.<br>
                    <span style="color: #FF4D4F; font-weight: 500;">
                      This will be reported as suspicious activity!
                    </span>
                  </p>
                  
                  <input 
                    id="confirmInput" 
                    type="text" 
                    placeholder="Type 'I CONFIRM'" 
                    style="
                      width: 100%;
                      padding: 12px 16px;
                      border-radius: 8px;
                      border: none;
                      background: rgba(255,255,255,0.1);
                      color: white;
                      font-size: 1rem;
                      margin-bottom: 1.5rem;
                      border: 1px solid rgba(255,255,255,0.2);
                      transition: all 0.3s ease;
                    "
                    onfocus="this.style.border='1px solid #6441a5'; this.style.background='rgba(255,255,255,0.15)';"
                    onblur="this.style.border='1px solid rgba(255,255,255,0.2)'; this.style.background='rgba(255,255,255,0.1)';"
                  >
                  
                  <div style="display: flex; gap: 12px;">
                    <button 
                      id="cancelBtn"
                      style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 8px;
                        border: none;
                        background: rgba(255,255,255,0.1);
                        color: white;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                      "
                      onmouseover="this.style.background='rgba(255,255,255,0.2)';"
                      onmouseout="this.style.background='rgba(255,255,255,0.1)';"
                    >
                      Cancel
                    </button>
                    
                    <button 
                      id="submitBtn" 
                      style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 8px;
                        border: none;
                        background: linear-gradient(90deg, #FF4D4F, #F06795);
                        color: white;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 15px rgba(240, 103, 149, 0.3);
                      "
                      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(240, 103, 149, 0.4)';"
                      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(240, 103, 149, 0.3)';"
                    >
                      Confirm Exit
                    </button>
                  </div>
                </div>
              </div>
            \`;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            document.getElementById('cancelBtn').onclick = () => {
              modal.remove();
              document.body.style.overflow = '';
              resolve(false);
            };
            
            document.getElementById('submitBtn').onclick = () => {
              const val = document.getElementById('confirmInput').value.trim();
              if (val === 'I CONFIRM') {
                modal.remove();
                document.body.style.overflow = '';
                resolve(true);
              } else {
                document.getElementById('confirmInput').style.border = '1px solid #FF4D4F';
                document.getElementById('confirmInput').style.animation = 'shake 0.5s';
                setTimeout(() => {
                  document.getElementById('confirmInput').style.animation = '';
                }, 500);
              }
            };
            
         
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
            \`;
            document.head.appendChild(style);
          });
        `).then((confirmExit) => {
          if (confirmExit) {
            allowExit = true;
            app.quit();
          }
        });
      }
    }
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      (async function() {
        try {
          const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          const previewModal = document.createElement('div');
          previewModal.style.position = 'fixed';
          previewModal.style.top = '0';
          previewModal.style.left = '0';
          previewModal.style.width = '100%';
          previewModal.style.height = '100%';
          previewModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          previewModal.style.zIndex = '1000000';
          previewModal.style.display = 'flex';
          previewModal.style.flexDirection = 'column';
          previewModal.style.alignItems = 'center';
          previewModal.style.justifyContent = 'center';
          previewModal.style.color = 'white';
          previewModal.innerHTML = \`
            <h2>Camera Preview</h2>
            <video id="cameraPreview" autoplay muted playsinline style="width: 300px; height: 220px; border: 2px solid white; border-radius: 10px;"></video>
            <br/>
            <button id="closePreview" style="padding: 10px 20px; background: green; border: none; color: white; border-radius: 5px; cursor: pointer;">Proceed</button>
          \`;
          document.body.appendChild(previewModal);

          const cameraVideo = document.getElementById('cameraPreview');
          cameraVideo.srcObject = camStream;

          document.getElementById('closePreview').onclick = () => {
            previewModal.remove();
            const videoBox = document.createElement('div');
            videoBox.style.position = 'fixed';
            videoBox.style.bottom = '20px';
            videoBox.style.right = '20px';
            videoBox.style.width = '200px';
            videoBox.style.height = '150px';
            videoBox.style.zIndex = '999999';
            videoBox.style.background = 'black';
            videoBox.style.border = '2px solid white';
            videoBox.style.cursor = 'move';
            videoBox.style.borderRadius = '10px';
            videoBox.style.overflow = 'hidden';
            document.body.appendChild(videoBox);

            const smallVideo = document.createElement('video');
            smallVideo.srcObject = camStream;
            smallVideo.autoplay = true;
            smallVideo.muted = true;
            smallVideo.style.width = '100%';
            smallVideo.style.height = '100%';
            videoBox.appendChild(smallVideo);

            videoBox.onmousedown = function(event) {
              event.preventDefault();
              let shiftX = event.clientX - videoBox.getBoundingClientRect().left;
              let shiftY = event.clientY - videoBox.getBoundingClientRect().top;

              function moveAt(pageX, pageY) {
                videoBox.style.left = pageX - shiftX + 'px';
                videoBox.style.top = pageY - shiftY + 'px';
                videoBox.style.bottom = 'auto';
                videoBox.style.right = 'auto';
              }

              function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
              }

              document.addEventListener('mousemove', onMouseMove);

              document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
              };
            };
            videoBox.ondragstart = function() {
              return false;
            };
          };
        } catch (err) {
          alert('Camera access is required to proceed.');
        }
      })();
    `);
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());