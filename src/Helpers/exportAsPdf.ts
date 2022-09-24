import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// @ts-ignore
import domtoimage from 'dom-to-image-more';

const exportAsPdf = () => {
  var node = document.getElementById('capture');
  // @ts-ignore
  domtoimage
    .toPng(node, {
      quality: 0,
    })
    .then(function (dataUrl: any) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error: any) {
      console.error('oops, something went wrong!', error);
    });
};

export default exportAsPdf;
