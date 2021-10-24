import fs from 'fs';
import path from 'path';
import vm, { Response } from 'virtual_modules';

const dirname = path.dirname(__dirname);
const modules = path.dirname(dirname);
const iconModule = vm.resolveModule('boxicons', modules);
const handle = (filename: string, res: Response) => {  
  //wait for .js so babel can parse it
  if (!/\.js$/.test(filename) || res.body) {
    return;
  }

  //extract the params from the filename
  const { params } = vm.routeParams(filename, `/**/:type/:name`);
  const type = params.type.toLowerCase();
  const name = params.name.substr(0, params.name.length - 3);
  let prefix = 'bx';
  if (type === 'logos') prefix += 'l';
  if (type === 'solid') prefix += 's';

  let svg = null;
  try {
    svg = fs.readFileSync(
      `${iconModule}/svg/${type}/${prefix}-${name.toLowerCase()}.svg`
    ).toString('utf8');
  } catch (e) {
    return;
  }

  svg = svg.replace(/width="[0-9]*"/, 'width={size}');
  svg = svg.replace(/height="[0-9]*"/, 'height={size}');
  svg = svg.replace('<svg', '<svg className={className} style={style}');

  res.write(
    `export default function BoxIcon(props) {
      const { className, style, size } = props 
      return ${svg} 
    }`
  );
};

//default
vm.route(`${dirname}/icons/:type/:name`, handle);
//any node modules
vm.route(`/**/node_modules/react-boxicons/:type/:name`, handle);
//monno repo
vm.route(`/**/react-boxicons/:type/:name`, handle);
//patch the FS
vm.patchFS();

export { vm }; 