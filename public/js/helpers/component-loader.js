function loadComponent(file) {
      const call = '/component?name=' + file;
      component = makeAjaxCall(call,"GET");
      component.then ( html => {
        const parser = new DOMParser();
        const fragment = parser.parseFromString(html, 'text/html');
        const originalTemplate = fragment.getElementsByTagName('TEMPLATE')[0];
        let template;
        if (originalTemplate) {
          template = document.createElement ('template');
          template.innerHTML = originalTemplate.innerHTML;
          template.id = originalTemplate.id;
          document.body.appendChild (template);
        }
        const originalScript = fragment.getElementsByTagName('SCRIPT')[0];
        let script;
        if (originalScript) {
          script = document.createElement ('script');
          script.innerHTML = originalScript.innerHTML;
          document.body.appendChild(script);
        }
      })
      component.catch( (e) => {
        console.log(e);
      })
}