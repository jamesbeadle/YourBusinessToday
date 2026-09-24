const packageNamespace = 'http://schemas.openxmlformats.org/package/2006';
const officeRelationships = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const wordMain = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

export const contentTypesXml = `${xmlDeclaration}
<Types xmlns="${packageNamespace}/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

export const packageRelationshipsXml = `${xmlDeclaration}
<Relationships xmlns="${packageNamespace}/relationships">
<Relationship Id="rId1" Type="${officeRelationships}/officeDocument" Target="word/document.xml"/>
</Relationships>`;

export const documentRelationshipsXml = `${xmlDeclaration}
<Relationships xmlns="${packageNamespace}/relationships">
<Relationship Id="rId1" Type="${officeRelationships}/styles" Target="styles.xml"/>
</Relationships>`;

const a4PageSectionXml =
	'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
	'<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';

export function documentXml(bodyXml: string): string {
	return `${xmlDeclaration}
<w:document xmlns:w="${wordMain}" xmlns:r="${officeRelationships}"><w:body>${bodyXml}${a4PageSectionXml}</w:body></w:document>`;
}
