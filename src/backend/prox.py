import json


def busca(ds, cod):
    retorno, i = None, 0
    while retorno == None and i < len(ds):
        retorno = ds[i] if ds[i]["cod"] == cod else None
        i += 1
    return retorno

    

def proximo(ds, d, pre, p:list=[]):
    if pre != '-':
        if isinstance(pre, str):
            # Eh um disciplina
            if pre not in p:
                # p.append(pre)
                dPre = busca(ds, pre)
                dPre['prox'].append(d['cod'])
                pass
        elif isinstance(pre, list):
            # Eh uma lista de disciplinas
            for i in pre:
                p = proximo(ds, d, i, p)
        elif isinstance(pre, dict):
            # Eh um dicionario
            p = proximo(ds, d, pre["ds"], p)
    return p


discs = json.load(open("/home/matheus/Área de Trabalho/2023.2/PROJETO E DESENVOLVIMENTO DE SISTEMAS DE INFORMAÇÃO II/ASUBR/src/backend//data/curso.json", "r"))
discs = [ x for x in discs if x["tipo"] == "DISCIPLINA" ]

# for i in discs:
#     print(i["name"])


for i in discs[6:]: 
    novo = []
    # i['prox'] = novo
    proximo(discs, i, i['pre'], novo)


# Salvar em um arquivo diferente agora
with open("data/curso2.json", "w") as f:
    json.dump(discs, f, indent=4, ensure_ascii=False)

# print(busca(discs, "MATD72"))







