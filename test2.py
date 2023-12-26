a = [1,2,3,2,1,5,6,5,5,5]

seen = set()
uniq = []
for x in a:
    if x not in seen:
        uniq.append(x)
        seen.add(x)
print(uniq)