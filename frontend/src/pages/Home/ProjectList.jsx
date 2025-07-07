import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProjectCard } from "../../components/project-details/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  fetchProjects,
  fetchUserCategories,
  fetchUserTags,
  searchProjects,
} from "@/state/Project/projectSlice";
import { useNavigate } from "react-router-dom";

export const ProjectList = () => {
  const project = useSelector((store) => store.project);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchProjects({}));
    dispatch(fetchUserTags());
    dispatch(fetchUserCategories());
  }, [dispatch]);

  const handleFilterCategory = (value) => {
    const category = value === "todos" ? undefined : value;
    dispatch(fetchProjects({ category }));
  };

  const handleFilterTags = (value) => {
    const tag = value === "todos" ? undefined : value;
    dispatch(fetchProjects({ tag }));
  };

  const handleSearchChange = (e) => {
    dispatch(searchProjects(e.target.value));
  };

  const toggleCategoriesVisibility = () => {
    setShowAllCategories(!showAllCategories);
  };

  const toggleTagsVisibility = () => {
    setShowAllTags(!showAllTags);
  };

  const visibleCategories =
    project.userCategories && showAllCategories
      ? project.userCategories
      : project.userCategories?.slice(0, limit) || [];

  const hiddenCategoriesCount = project.userCategories
    ? project.userCategories.length - visibleCategories.length
    : 0;

  const visibleTags =
    project.userTags && showAllTags
      ? project.userTags
      : project.userTags?.slice(0, limit) || [];

  const hiddenTagsCount = project.userTags
    ? project.userTags.length - visibleTags.length
    : 0;

  if (!project.userCategories || !project.userTags) {
    return <div>Carregando filtros...</div>;
  }

  return (
    <div className="relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5">
      <section className="filterSection">
        <Card className="p-5 sticky top-10">
          <div className="lg:w-[20rem]">
            <p className="text-xl -tracking-wider">Filtros</p>
          </div>
          <CardContent className="mt-5">
            <ScrollArea className="space-y-7 h-[70vh]">
              <div>
                <h1 className="pb-3 text-gray-400 border-b">Categoria</h1>

                <div className="pt-5">
                  {project.userCategories?.length > 0 ? (
                    <>
                      <RadioGroup
                        defaultValue="todos"
                        className="space-y-3"
                        onValueChange={handleFilterCategory}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="todos" id="cat-todos" />
                          <Label htmlFor="cat-todos">Todos</Label>
                        </div>
                        {visibleCategories.map((cat) => (
                          <div key={cat.id} className="flex items-center gap-2">
                            <RadioGroupItem
                              value={cat.name}
                              id={`cat-${cat.id}`}
                            />
                            <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {project.userCategories.length > limit && (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            className="p-0 text-sm(ID text-blue-500"
                            onClick={toggleCategoriesVisibility}
                          >
                            {!showAllCategories
                              ? `+${hiddenCategoriesCount} Categorias Ocultas`
                              : "Ocultar Categorias"}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500 mt-2">
                      Nenhuma categoria foi criada ainda.
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-9">
                <h1 className="pb-3 text-gray-400 border-b">Tags</h1>

                <div className="pt-5">
                  {project.userTags?.length > 0 ? (
                    <>
                      <RadioGroup
                        defaultValue="todos"
                        className="space-y-3"
                        onValueChange={handleFilterTags}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="todos" id="tag-todos" />
                          <Label htmlFor="tag-todos">Todos</Label>
                        </div>
                        {visibleTags.map((tag) => (
                          <div key={tag.id} className="flex items-center gap-2">
                            <RadioGroupItem
                              value={tag.name}
                              id={`tag-${tag.id}`}
                            />
                            <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {project.userTags.length > limit && (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            className="p-0 text-sm text-blue-500"
                            onClick={toggleTagsVisibility}
                          >
                            {!showAllTags
                              ? `+${hiddenTagsCount} Tags Ocultas`
                              : "Ocultar Tags"}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500 mt-2">
                      Nenhuma tag foi criada ainda.
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
      <section className="projectListSection w-full lg:w-[48rem]">
        <div className="flex gap-2 items-center pb-5 justify-between">
          <div className="relative w-full mt-4 lg:mt-0">
            <Input
              onChange={handleSearchChange}
              placeholder="Pesquise por projetos"
              className="px-9"
            />
            <MagnifyingGlassIcon className="absolute top-3 left-4" />
          </div>
        </div>
        <div className="space-y-5 min-h-[74vh]">
          {project.searchProjects?.length > 0
            ? project.searchProjects
                .filter((item) => item && item.id)
                .map((item) => <ProjectCard item={item} key={item.id} />)
            : project.projects
                ?.filter((item) => item && item.id)
                .map((item) => <ProjectCard item={item} key={item.id} />)}
        </div>
      </section>
    </div>
  );
};
