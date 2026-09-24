(function() {
    'use strict';

    let app = {
        status: {
            popupOpen: false,
            lastClickedImgCard: '',
            currentFolder: ''
        },
        parameters: {
            animationDelay: 300
        },
        data: {
            images: {},
            folders: []
        },
        components: {},
        containers: {}
    };

    app.readFiles = () => {
        let uniqueId = 0;

        fetch(`/getImages`)
        .then(response => response.json())
        .then(json => {
            app.data.images = json.data;

            Object.keys(app.data.images).forEach(key => {
                app.data.folders.push(key);
                app.fabricateFolderBtn(app.containers.folderContainer, key);
                app.data.images[key].forEach((image, index)  => {
                    app.fabricateImageCard(image.file, image.text, `${uniqueId}`, key);
                    uniqueId++
                });
            });

            const container = document.querySelector('.folder-container');

            [...container.children]
            .sort((a, b) => a.innerText < b.innerText ? 1 : -1)
            .forEach(node => container.appendChild(node));


            $('.folder').on('click', (event) => {
                let folders = document.querySelectorAll('.folder');
                folders.forEach(folder => folder.classList.remove('selected'));
                event.currentTarget.classList.add('selected');
                app.status.currentFolder = event.currentTarget.dataset.folder;
                app.filterImages(app.status.currentFolder);
            });

            $('.folder.generated').first().trigger('click');

            $('.card.image').on('click', (event) => {
                let text = event.currentTarget.children[0].children[0].children[0].innerHTML;
                let src = event.currentTarget.children[1].src;
                app.showPopup((text ? text : ''), src);
                app.status.popupOpen = true;
                app.status.lastClickedImgCard = event.currentTarget.id;
            });
        });
    }

    app.fabricateButton = (btnClass, labelText, type, target, toDoFunction, container, hintText = '') => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.add(btnClass);
        newBtn.classList.add('btn');
        newBtn.classList.remove ('template');

        newBtn.innerHTML = labelText;
        newBtn.title = hintText;

        switch (type) {
            case 'gizmo':
                $(newBtn).on('click', () => {
                    $(`.gizmo.${target}`).show();
                    $(`.gizmo.${target}`).addClass('active');
                    $(`.landing-page-content`).addClass('hidden');
                    $(app.components.btnClose).show();
                    $(app.components.btnClose).addClass('active');
                    $('.landing-page-content').addClass('blurred');
                    $('body').addClass('locked');
                });
                break;
            case 'link':
                $(newBtn).on('click', () => {
                    window.open(btnPattern.target, '_blank');
                });
                break;
        case 'function':
                $(newBtn).on('click', () => {
                    toDoFunction();
                });
                break;
            default:

                break;
        }
        container.appendChild(newBtn);
    };

    app.fabricateSwitch = (container, labelText, checkboxClass, checked = true, hintText = '') => {
        let newSwitch = app.components.switchTemplate.cloneNode(true);
        
        newSwitch.classList.add('generated');
        newSwitch.classList.remove ('template');
        newSwitch.querySelector('.label').innerHTML = labelText;
        newSwitch.querySelector('.label').title = hintText;
        newSwitch.querySelector('.switch').classList.add(checkboxClass);
        newSwitch.querySelector('input').checked = checked;

        container.appendChild(newSwitch);
    };

    app.fabricateFolderBtn = (container, folder) => {
        let newFolderBtn = app.components.folderBtnTemplate.cloneNode(true);

        newFolderBtn.classList.add('generated');
        newFolderBtn.classList.remove ('template');
        newFolderBtn.innerText = folder;
        newFolderBtn.dataset.folder = folder;

        container.appendChild(newFolderBtn);
    };

    app.fabricateImageCard = (img, text, id, folder) => {
        let newImageCard = app.components.imageCardTemplate.cloneNode(true);

        newImageCard.classList.add('generated');
        newImageCard.classList.remove ('template');
        newImageCard.id = id;
        newImageCard.dataset.folder = folder;
        newImageCard.querySelector('.img-overlay > .img-text > p').innerHTML = text;
        newImageCard.querySelector('.img-overlay').classList.add('no-text');
        newImageCard.querySelector('.card-img').src = `images/full/${img}`;

        app.containers.imageContainer.appendChild(newImageCard);
    }

    app.addSeparator = (container) => {
        let newSeparator = app.components.separatorTemplate.cloneNode(true);

        newSeparator.classList.add('generated');
        newSeparator.classList.remove ('template');

        container.prepend(newSeparator);
    };
    
    app.showPopup = (text, img) => {
        let form = document.querySelector('.img-form');
        let paragraph = form.querySelector('.popup-img-text');
        let image = form.querySelector('.popup-img');

        $('.popup').addClass('active');
        $('.landing-page-content').addClass('blurred');
        image.src = img;

        paragraph.innerHTML = text;
        paragraph.style.maxWidth = image.width + 'px';
    };

    app.showNotificationToast = (text, type = '') => {
        let newNotification = app.components.notificationTemplate.cloneNode(true);

        newNotification.classList.add('generated');
        newNotification.classList.remove ('template');

        switch (type) {
            case 'positive':
                newNotification.classList.add('positive');
                break;
            case 'negative':
                newNotification.classList.add('negative');
                break;
            default:
                break;
        };

        newNotification.querySelector('.notification-text').innerHTML = text;

        $(newNotification).on('click', () => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        });

        setTimeout(() => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        }, 10*app.parameters.animationDelay);

        $(app.containers.notificationPanel).show();

        app.containers.notificationPanel.prepend(newNotification);
    };

    app.filterImages = (folder) => {
        let images = document.querySelectorAll('.card.image');

        images.forEach(image => {
            image.classList.add('hidden');
            if (image.dataset.folder == app.status.currentFolder) image.classList.remove ('hidden');
        });

        resizeGridItems();
    }

    $(function() {
        app.containers.header = document.querySelector('.header');
        app.containers.notificationPanel = document.querySelector('.notification-panel');
        app.containers.imageContainer = document.querySelector('.image-container');
        app.containers.folderContainer = document.querySelector('.folder-container');
        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');
        app.components.notificationTemplate = document.querySelector('.notification.template');
        app.components.imageCardTemplate = document.querySelector('.card.image.template');
        app.components.folderBtnTemplate = document.querySelector('.folder.template');



        window.onload = () => {
            app.readFiles();
        }

        setTimeout(() => {
            resizeGridItems();
            $(app.components.spinner).hide();
        }, 1000);

        {
            document.addEventListener('keydown', (e) => {
                if (app.status.popupOpen) {
                    if (e.key == 'ArrowRight' && $(`#${app.status.lastClickedImgCard}`).next()[0]) {
                        if (!$(`#${app.status.lastClickedImgCard}`).next()[0].classList.contains('hidden')) $(`#${app.status.lastClickedImgCard}`).next().trigger('click');
                    } else if (e.key == 'ArrowLeft' && $(`#${app.status.lastClickedImgCard}`).prev()[0]) {
                        if (!$(`#${app.status.lastClickedImgCard}`).prev()[0].classList.contains('hidden')) $(`#${app.status.lastClickedImgCard}`).prev().trigger('click');
                    }
                }
            });
        }

        window.addEventListener('resize', resizeGridItems);

        $('.logo').on('click', () => {
            window.location.href="/";
        });

        $('.close-popup-btn').on('click', () => {
            $('.popup').removeClass('active');
            $('.landing-page-content').removeClass('blurred');
            app.status.popupOpen = false;
        });

        $('.popup-img-underlay').on('click', (event) => {
            event.stopPropagation();
            $('.close-popup-btn').trigger('click');
        });
        
        $('.popup-scroll-btn.left').on('click', () => {
            if ($(`#${app.status.lastClickedImgCard}`).prev()[0]) {
                if (!$(`#${app.status.lastClickedImgCard}`).prev()[0].classList.contains('hidden')) $(`#${app.status.lastClickedImgCard}`).prev().trigger('click');
            }
        });

        $('.popup-scroll-btn.right').on('click', () => {
            if ($(`#${app.status.lastClickedImgCard}`).next()[0]) {
                if (!$(`#${app.status.lastClickedImgCard}`).next()[0].classList.contains('hidden')) $(`#${app.status.lastClickedImgCard}`).next().trigger('click');
            }
        });
    });

    function resizeGridItems() {
        const items = document.querySelectorAll('.card');

        const rowGap = parseInt(window.getComputedStyle(app.containers.imageContainer).getPropertyValue('gap'));

        items.forEach(item => {
            // Calculate how many rows the image needs based on its actual height
            const rowSpan = round((item.getBoundingClientRect().height + rowGap) / (1 + rowGap));
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    }


    function round(value, decimals = 0) {
        let returnNum = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return returnNum ? returnNum : 0;
    };

    function findNumberPosition(number, lower, upper) {
        let array = [];
        for (let i = lower; i < upper; i += 0.05) {
            array.push(i);
        };

        let L = 0;
        let R = array.length - 1;
        let m = 0;

        while (L <= R) {
            m = Math.floor((L + R)/2);
            if (array[m] + 0.1 < number)
                L = m + 1
            else if (array[m] - 0.1 > number)
                R = m - 1
            else
                return m/(array.length - 1)
        };

        return 0.5;
    };

    function shuffle(array) {
        let shuffledArray = array;
        let currentIndex = shuffledArray.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = shuffledArray[currentIndex];
          shuffledArray[currentIndex] = shuffledArray[randomIndex];
          shuffledArray[randomIndex] = temporaryValue;
        }
      
        return shuffledArray;
      };

})();
